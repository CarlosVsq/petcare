import express from 'express';
import cors from 'cors';
import medicamentos from './routes/medicamentos.js';
import clinica from './routes/clinica.js';
import notificaciones from './routes/notificaciones.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/medicamentos', medicamentos);
app.use('/clinica', clinica);
app.use('/notificaciones', notificaciones);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`APIs externas de PetCare en http://0.0.0.0:${PORT}`);
});
