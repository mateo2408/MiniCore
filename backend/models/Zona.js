const mongoose = require('mongoose');

const ZonaSchema = new mongoose.Schema({
  id_zona: {
    type: Number,
    required: true,
    unique: true
  },
  nombre_zona: {
    type: String,
    required: true
  },
  tarifa_por_kg: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Zona', ZonaSchema);
