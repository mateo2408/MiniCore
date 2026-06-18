const Repartidor = require('../models/Repartidor');
const Envio = require('../models/Envio');

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// Obtener el reporte de costos de envíos por repartidor en un rango de fechas
const getReporteEnvios = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione fechaInicio y fechaFin (formato YYYY-MM-DD)'
      });
    }

    // Convertir a fechas y ajustar horas para abarcar todo el día
    const inicio = new Date(fechaInicio);
    inicio.setUTCHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setUTCHours(23, 59, 59, 999);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Utilice YYYY-MM-DD'
      });
    }

    // 1. Obtener todos los repartidores
    const repartidores = await Repartidor.find().lean();

    // 2. Obtener los envíos dentro del rango de fechas
    const envios = await Envio.find({
      fecha_envio: {
        $gte: inicio,
        $lte: fin
      }
    })
    .populate('repartidor')
    .populate('zona')
    .lean();

    // 3. Procesar datos por repartidor
    const reporte = repartidores.map(rep => {
      // Filtrar los envíos que pertenecen a este repartidor
      const enviosRepartidor = envios.filter(env => 
        env.repartidor && env.repartidor._id.toString() === rep._id.toString()
      );

      let totalKg = 0;
      let costoTotal = 0;
      const zonasMap = new Map();

      // Procesar cada envío del repartidor
      const enviosDetalle = enviosRepartidor.map(env => {
        const peso = Number(env.peso_kg) || 0;
        const tarifa = env.zona ? (Number(env.zona.tarifa_por_kg) || 0) : 0;
        const costoEnvio = roundMoney(peso * tarifa);

        totalKg += peso;
        costoTotal += costoEnvio;

        if (env.zona) {
          const zonaNombre = env.zona.nombre_zona;
          zonasMap.set(zonaNombre, (zonasMap.get(zonaNombre) || 0) + 1);
        }

        return {
          id_envio: env.id_envio,
          peso_kg: peso,
          fecha_envio: env.fecha_envio,
          zona: env.zona ? {
            nombre_zona: env.zona.nombre_zona,
            tarifa_por_kg: env.zona.tarifa_por_kg
          } : null,
          costo: costoEnvio
        };
      });

      // Determinar qué zona(s) y tarifa(s) mostrar
      let zonaMostrada = '—';
      let tarifaMostrada = '—';

      if (zonasMap.size === 1) {
        // Entregó en una sola zona
        const unicaZona = Array.from(zonasMap.keys())[0];
        zonaMostrada = unicaZona;
        
        // Encontrar la tarifa de esa zona en el primer envío que coincida
        const envioCoincidente = enviosRepartidor.find(env => env.zona && env.zona.nombre_zona === unicaZona);
        tarifaMostrada = envioCoincidente ? `$${envioCoincidente.zona.tarifa_por_kg.toFixed(2)}` : '—';
      } else if (zonasMap.size > 1) {
        // Entregó en varias zonas
        zonaMostrada = 'Múltiples';
        // Crear un listado resumido para el tooltip/detalle
        tarifaMostrada = 'Varios';
      }

      return {
        id_repartidor: rep.id_repartidor,
        nombre: rep.nombre,
        email: rep.email || 'No especificado',
        cantidadEnvios: enviosRepartidor.length,
        totalKg: enviosRepartidor.length > 0 ? totalKg : 0,
        zona: zonaMostrada,
        tarifa: tarifaMostrada,
        costoTotal: enviosRepartidor.length > 0 ? roundMoney(costoTotal) : 0,
        envios: enviosDetalle
      };
    });

    res.json({
      success: true,
      data: reporte,
      rango: {
        inicio: fechaInicio,
        fin: fechaFin
      }
    });

  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al procesar el reporte'
    });
  }
};

module.exports = {
  getReporteEnvios
};
