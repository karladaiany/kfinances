const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['checking', 'savings', 'investment', 'wallet', 'other'],
    default: 'checking'
  },
  institution: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  initialBalance: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
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
    default: '#3498db'
  },
  icon: {
    type: String,
    default: 'bank'
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
AccountSchema.plugin(encrypt, {
  encryptionKey: encryptionKey,
  signingKey: encryptionKey,
  encryptedFields: ['accountNumber']
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
