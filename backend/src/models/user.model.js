const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'family_member', 'guest'],
    default: 'guest'
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  subscription: {
    status: {
      type: String,
      enum: ['trial', 'active', 'expired', 'cancelled'],
      default: 'trial'
    },
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    },
    currentPeriodEnds: {
      type: Date
    },
    paymentId: {
      type: String
    }
  },
  lastLogin: {
    type: Date
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
const signingKey = process.env.SIGNING_KEY;
UserSchema.plugin(encrypt, {
  encryptionKey: encryptionKey,
  signingKey: signingKey,
  encryptedFields: ['twoFactorSecret']
});

// Método para verificar se o período de teste expirou
UserSchema.methods.isTrialExpired = function() {
  if (this.subscription.status !== 'trial') return false;
  return new Date() > this.subscription.trialEndsAt;
};

// Método para verificar se a assinatura está ativa
UserSchema.methods.hasActiveSubscription = function() {
  if (this.subscription.status === 'trial' && !this.isTrialExpired()) {
    return true;
  }
  return this.subscription.status === 'active' && new Date() < this.subscription.currentPeriodEnds;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
