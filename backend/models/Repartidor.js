const mongoose = require('mongoose');

const RepartidorSchema = new mongoose.Schema({
  id_repartidor: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Repartidor', RepartidorSchema);
