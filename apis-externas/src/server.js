import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import medicamentos from './routes/medicamentos.js';
import clinica from './routes/clinica.js';
import notificaciones from './routes/notificaciones.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    const hora = new Date().toLocaleTimeString('es-CL');
    const origen = req.ip.replace('::ffff:', '');
    console.log(`[${hora}] ${req.method} ${req.originalUrl} desde ${origen} -> ${res.statusCode}`);
  });
  next();
});

app.use('/medicamentos', medicamentos);
app.use('/clinica', clinica);
app.use('/notificaciones', notificaciones);

app.use((req, res) => {
  res.status(404).json({ status: 404, error: 'Not Found', mensaje: 'Ruta no encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`APIs externas de PetCare en http://0.0.0.0:${PORT}`);
});
