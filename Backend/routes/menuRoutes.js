const express = require('express');
const multer = require('multer');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
  },
});

const router = express.Router();

// Category routes
router.get('/categories', getCategories);
router.post('/categories', authMiddleware, upload.single('image'), createCategory);
router.put('/categories/:id', authMiddleware, upload.single('image'), updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

// Menu item routes
router.get('/', getMenuItems);
router.post('/', authMiddleware, upload.single('image'), createMenuItem);
router.put('/:id', authMiddleware, upload.single('image'), updateMenuItem);
router.delete('/:id', authMiddleware, deleteMenuItem);

module.exports = router;