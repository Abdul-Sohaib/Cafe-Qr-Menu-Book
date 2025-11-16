const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, quote } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Category image is required' });
    }

    // Validate file size
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        message: `File too large (${(req.file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB` 
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            if (error.message?.includes('rate limit')) {
              reject(new Error('Upload rate limit exceeded. Please try again later.'));
            } else if (error.message?.includes('quota') || error.message?.includes('credit')) {
              reject(new Error('Cloudinary quota exceeded. Please upgrade your plan or wait for monthly reset.'));
            } else if (error.http_code === 420) {
              reject(new Error('Rate limit exceeded. Please wait and try again.'));
            } else {
              reject(new Error(`Image upload failed: ${error.message || 'Unknown error'}`));
            }
          } else {
            resolve(result);
          }
        }
      );
      const bufferStream = require('stream').PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    const category = new Category({
      name,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      quote: quote || '',
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quote } = req.body;
    const updateData = { name };

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (quote !== undefined) {
      updateData.quote = quote;
    }

    if (req.file) {
      const existingCategory = await Category.findById(id);
      if (existingCategory && existingCategory.imagePublicId) {
        await cloudinary.uploader.destroy(existingCategory.imagePublicId);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        const bufferStream = require('stream').PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);
      });

      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    const items = await MenuItem.find({ categoryId: id });
    if (items.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with associated items' });
    }

    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};
    const items = await MenuItem.find(query).populate('categoryId', 'name');
    res.json(items);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, price, categoryId, varieties } = req.body;

    console.log('Create MenuItem Request Body:', req.body);

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    let parsedVarieties = [];
    if (varieties) {
      try {
        parsedVarieties = typeof varieties === 'string' ? JSON.parse(varieties) : varieties;
      } catch (e) {
        console.error('Error parsing varieties:', e);
        return res.status(400).json({ message: 'Invalid varieties format' });
      }
    }

    const menuItem = new MenuItem({
      name,
      price: parseFloat(price),
      categoryId,
      isOutOfStock: false,
      varieties: parsedVarieties
    });

    await menuItem.save();
    const populatedItem = await MenuItem.findById(menuItem._id).populate('categoryId', 'name');
    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, varieties } = req.body;

    console.log('Update MenuItem Request Body:', req.body);

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    let parsedVarieties = [];
    if (varieties) {
      try {
        parsedVarieties = typeof varieties === 'string' ? JSON.parse(varieties) : varieties;
      } catch (e) {
        console.error('Error parsing varieties:', e);
        return res.status(400).json({ message: 'Invalid varieties format' });
      }
    }

    const updateData = { 
      name, 
      price: parseFloat(price), 
      categoryId,
      varieties: parsedVarieties
    };

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true }).populate('categoryId', 'name');
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const toggleOutOfStock = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    menuItem.isOutOfStock = !menuItem.isOutOfStock;
    await menuItem.save();
    
    res.json({ 
      message: `Item marked as ${menuItem.isOutOfStock ? 'out of stock' : 'in stock'}`, 
      item: menuItem 
    });
  } catch (error) {
    console.error('Toggle out of stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findById(id);

    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });

    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleOutOfStock
};