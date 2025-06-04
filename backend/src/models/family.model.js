const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'viewer'],
      default: 'member'
    },
    permissions: {
      canAddTransactions: {
        type: Boolean,
        default: true
      },
      canEditTransactions: {
        type: Boolean,
        default: true
      },
      canDeleteTransactions: {
        type: Boolean,
        default: false
      },
      canViewReports: {
        type: Boolean,
        default: true
      },
      canManageAccounts: {
        type: Boolean,
        default: false
      },
      canManageCategories: {
        type: Boolean,
        default: false
      },
      canInviteMembers: {
        type: Boolean,
        default: false
      }
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  invites: [{
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'viewer'],
      default: 'member'
    },
    expiresAt: {
      type: Date,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
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

// Campos a serem criptografados
const encryptionKey = process.env.ENCRYPTION_KEY;
FamilySchema.plugin(encrypt, {
  encryptionKey: encryptionKey,
  signingKey: encryptionKey,
  encryptedFields: ['invites.token']
});

const Family = mongoose.model('Family', FamilySchema);

module.exports = Family;
