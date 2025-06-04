const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    default: 'expense'
  },
  color: {
    type: String,
    default: '#3498db'
  },
  icon: {
    type: String,
    default: 'tag'
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  budget: {
    amount: {
      type: Number,
      default: 0
    },
    period: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance das consultas
CategorySchema.index({ familyId: 1, type: 1 });
CategorySchema.index({ familyId: 1, isDefault: 1 });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
