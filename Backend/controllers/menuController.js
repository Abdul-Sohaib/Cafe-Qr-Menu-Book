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

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(new Error('Image upload failed'));
          else resolve(result);
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

    // Update quote field if provided (even if empty string)
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
    const { name, price, description, categoryId, varieties } = req.body;

    if (!name || !price || !description || !categoryId) {
      return res.status(400).json({ message: 'Name, price, description, and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(new Error('Image upload failed'));
          else resolve(result);
        }
      );
      const bufferStream = require('stream').PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadStream);
    });

    const parsedVarieties = varieties ? JSON.parse(varieties) : [];

    const menuItem = new MenuItem({
      name,
      price: parseFloat(price),
      description,
      categoryId,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      isOutOfStock: false,
      varieties: parsedVarieties
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId, varieties } = req.body;
    const updateData = { 
      name, 
      price: parseFloat(price), 
      description, 
      categoryId,
      varieties: varieties ? JSON.parse(varieties) : []
    };

    if (!name || !price || !description || !categoryId) {
      return res.status(400).json({ message: 'Name, price, description, and category are required' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    if (req.file) {
      const existingItem = await MenuItem.findById(id);
      if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      if (existingItem.imagePublicId) {
        await cloudinary.uploader.destroy(existingItem.imagePublicId);
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

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true }).populate('categoryId', 'name');
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
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

    if (deletedItem.imagePublicId) {
      await cloudinary.uploader.destroy(deletedItem.imagePublicId);
    }

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