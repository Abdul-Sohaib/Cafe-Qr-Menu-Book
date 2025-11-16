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
  toggleOutOfStock
} = require('../controllers/menuController');
const { authMiddleware } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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
router.post('/', authMiddleware, createMenuItem); // ← MISSING ROUTE ADDED
router.put('/:id', authMiddleware, updateMenuItem); // ← MISSING ROUTE ADDED
router.delete('/:id', authMiddleware, deleteMenuItem);
router.patch('/:id/toggle-stock', authMiddleware, toggleOutOfStock);

module.exports = router;