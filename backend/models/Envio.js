const mongoose = require('mongoose');

const EnvioSchema = new mongoose.Schema({
  id_envio: {
    type: Number,
    required: true,
    unique: true
  },
  repartidor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repartidor',
    required: true
  },
  zona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zona',
    required: true
  },
  peso_kg: {
    type: Number,
    required: true
  },
  fecha_envio: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Envio', EnvioSchema);
