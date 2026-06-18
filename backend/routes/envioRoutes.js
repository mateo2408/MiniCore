const express = require('express');
const router = express.Router();
const { getReporteEnvios } = require('../controllers/envioController');

// Ruta para obtener el reporte de envíos
router.get('/reporte', getReporteEnvios);

module.exports = router;
