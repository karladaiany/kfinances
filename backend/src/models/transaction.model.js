const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  creditCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditCard'
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
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceInfo: {
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']
    },
    endDate: {
      type: Date
    },
    nextOccurrence: {
      type: Date
    }
  },
  isInstallment: {
    type: Boolean,
    default: false
  },
  installmentInfo: {
    totalInstallments: {
      type: Number
    },
    currentInstallment: {
      type: Number
    },
    installmentGroupId: {
      type: String
    }
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    percentage: {
      type: Number,
      default: 0
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String
  },
  tags: [{
    type: String
  }],
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
TransactionSchema.index({ familyId: 1, date: -1 });
TransactionSchema.index({ familyId: 1, category: 1 });
TransactionSchema.index({ familyId: 1, account: 1 });
TransactionSchema.index({ familyId: 1, creditCard: 1 });
TransactionSchema.index({ familyId: 1, createdBy: 1 });
TransactionSchema.index({ familyId: 1, isVerified: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
