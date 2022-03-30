const mongoose = require('mongoose');

const rfidTagSchema = mongoose.Schema({
    tagId: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    deletedAt: {
      type: Date,
      default: null
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  rfidTagSchema.pre('save', function (next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
    next();
  });
  
  rfidTagSchema.pre('findOneAndUpdate', function (next) {
    const now = new Date();
    this.updatedAt = now;
    next();
  });
  
  const RfidTag = mongoose.model('RfidTag', rfidTagSchema);
  
  module.exports = RfidTag;
  