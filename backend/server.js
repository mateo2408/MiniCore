const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Modelos para el Seeding
const Repartidor = require('./models/Repartidor');
const Zona = require('./models/Zona');
const Envio = require('./models/Envio');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
connectDB();

// Función de Auto-Seeding (Semilla)
const seedDatabase = async () => {
  try {
    console.log('Verificando datos semilla...');

    const zonasBase = [
      { id_zona: 1, nombre_zona: 'Centro', tarifa_por_kg: 1.20 },
      { id_zona: 2, nombre_zona: 'Norte', tarifa_por_kg: 1.50 },
      { id_zona: 3, nombre_zona: 'Sur', tarifa_por_kg: 2.00 },
      { id_zona: 4, nombre_zona: 'Este', tarifa_por_kg: 1.80 },
      { id_zona: 5, nombre_zona: 'Oeste', tarifa_por_kg: 1.65 },
      { id_zona: 6, nombre_zona: 'Valle', tarifa_por_kg: 2.25 }
    ];

    const repartidoresBase = [
      { id_repartidor: 1, nombre: 'Andrés', email: 'andres@logistica.com' },
      { id_repartidor: 2, nombre: 'Camila', email: 'camila@logistica.com' },
      { id_repartidor: 3, nombre: 'Luis', email: 'luis@logistica.com' },
      { id_repartidor: 4, nombre: 'Sofía', email: 'sofia@logistica.com' },
      { id_repartidor: 5, nombre: 'Mateo', email: 'mateo@logistica.com' },
      { id_repartidor: 6, nombre: 'Valentina', email: 'valentina@logistica.com' }
    ];

    await Zona.bulkWrite(zonasBase.map(zona => ({
      updateOne: {
        filter: { id_zona: zona.id_zona },
        update: { $set: zona },
        upsert: true
      }
    })));

    await Repartidor.bulkWrite(repartidoresBase.map(repartidor => ({
      updateOne: {
        filter: { id_repartidor: repartidor.id_repartidor },
        update: { $set: repartidor },
        upsert: true
      }
    })));

    const zonas = await Zona.find({ id_zona: { $in: zonasBase.map(z => z.id_zona) } });
    const repartidores = await Repartidor.find({ id_repartidor: { $in: repartidoresBase.map(r => r.id_repartidor) } });
    const zonaPorId = new Map(zonas.map(zona => [zona.id_zona, zona]));
    const repartidorPorId = new Map(repartidores.map(repartidor => [repartidor.id_repartidor, repartidor]));

    const enviosBase = [
      [1, 1, 2, 6, '2025-01-05T10:00:00Z'],
      [2, 2, 3, 8, '2025-01-12T11:30:00Z'],
      [3, 3, 1, 5, '2025-01-19T09:15:00Z'],
      [4, 4, 4, 12, '2025-01-26T14:45:00Z'],
      [5, 5, 5, 7, '2025-02-03T10:20:00Z'],
      [6, 6, 6, 9, '2025-02-08T16:00:00Z'],
      [7, 1, 1, 4, '2025-02-14T08:40:00Z'],
      [8, 2, 2, 11, '2025-02-22T13:10:00Z'],
      [9, 3, 3, 6, '2025-03-02T09:00:00Z'],
      [10, 4, 4, 10, '2025-03-06T12:20:00Z'],
      [11, 5, 1, 5, '2025-03-13T15:30:00Z'],
      [12, 6, 5, 13, '2025-03-28T10:50:00Z'],
      [13, 1, 2, 10, '2025-04-04T10:00:00Z'],
      [14, 2, 3, 12, '2025-04-09T11:10:00Z'],
      [15, 3, 6, 8, '2025-04-16T09:25:00Z'],
      [16, 4, 5, 6, '2025-04-24T14:00:00Z'],
      [17, 1, 4, 5, '2025-05-03T10:00:00Z'],
      [18, 2, 5, 9, '2025-05-07T12:00:00Z'],
      [19, 3, 6, 11, '2025-05-11T09:30:00Z'],
      [20, 4, 2, 6, '2025-05-14T15:00:00Z'],
      [21, 5, 3, 7, '2025-05-18T14:00:00Z'],
      [22, 6, 1, 8, '2025-05-21T08:00:00Z'],
      [23, 2, 6, 10, '2025-05-24T11:00:00Z'],
      [24, 3, 5, 4, '2025-05-27T16:30:00Z'],
      [25, 4, 4, 9, '2025-05-30T09:00:00Z'],
      [26, 5, 1, 6, '2025-05-31T08:30:00Z'],
      [27, 5, 5, 9, '2025-06-03T17:20:00Z'],
      [28, 6, 6, 6, '2025-06-05T10:05:00Z'],
      [29, 1, 2, 10, '2025-06-02T10:00:00Z'],
      [30, 2, 3, 12, '2025-06-07T10:00:00Z'],
      [31, 3, 1, 4, '2025-06-11T09:45:00Z'],
      [32, 4, 6, 15, '2025-06-18T13:35:00Z'],
      [33, 5, 4, 7, '2025-07-01T08:30:00Z'],
      [34, 6, 5, 10, '2025-07-09T15:10:00Z'],
      [35, 1, 1, 8, '2025-07-17T12:00:00Z'],
      [36, 2, 6, 11, '2025-07-24T16:50:00Z'],
      [37, 3, 2, 6, '2025-08-04T10:10:00Z'],
      [38, 4, 3, 9, '2025-08-12T11:25:00Z'],
      [39, 5, 6, 12, '2025-08-20T14:15:00Z'],
      [40, 6, 1, 5, '2025-08-29T09:40:00Z']
    ].map(([id_envio, id_repartidor, id_zona, peso_kg, fecha_envio]) => ({
      id_envio: id_envio + 100,
      repartidor: repartidorPorId.get(id_repartidor)._id,
      zona: zonaPorId.get(id_zona)._id,
      peso_kg,
      fecha_envio: new Date(fecha_envio)
    }));

    const resultadoEnvios = await Envio.bulkWrite(enviosBase.map(envio => ({
      updateOne: {
        filter: { id_envio: envio.id_envio },
        update: { $set: envio },
        upsert: true
      }
    })));

    console.log(`Datos semilla listos. Envíos nuevos agregados: ${resultadoEnvios.upsertedCount || 0}`);
  } catch (err) {
    console.error('Error durante el seeding:', err);
  }
};

// Ejecutar Seeding tras conectar
app.use((req, res, next) => {
  next();
});

// Llamar al seed después de un breve retardo para asegurar la conexión
setTimeout(seedDatabase, 2000);

// API Routes
app.use('/api/envios', require('./routes/envioRoutes'));

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Servir Frontend en Producción
if (process.env.NODE_ENV === 'production') {
  // Ajustamos para Angular: dist/frontend/browser
  const distPath = path.join(__dirname, '../frontend/dist/frontend/browser');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    // Si la ruta no empieza con /api, sirve el index.html de Angular
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya está en uso. Cambia PORT en backend/.env o detén el proceso que lo está ocupando.`);
    process.exit(1);
  }

  throw error;
});
