const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const CreditCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  lastFourDigits: {
    type: String,
    trim: true,
    maxlength: 4
  },
  cardholderName: {
    type: String,
    trim: true
  },
  totalLimit: {
    type: Number,
    default: 0
  },
  availableLimit: {
    type: Number,
    default: 0
  },
  closingDay: {
    type: Number,
    min: 1,
    max: 31,
    required: true
  },
  dueDay: {
    type: Number,
    min: 1,
    max: 31,
    required: true
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#e74c3c'
  },
  icon: {
    type: String,
    default: 'credit-card'
  },
  notes: {
    type: String
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

// Campos a serem criptografados
const encryptionKey = process.env.ENCRYPTION_KEY;
CreditCardSchema.plugin(encrypt, {
  encryptionKey: encryptionKey,
  signingKey: encryptionKey,
  encryptedFields: ['lastFourDigits', 'cardholderName']
});

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);

module.exports = CreditCard;
