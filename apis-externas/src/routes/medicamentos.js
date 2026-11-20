import { Router } from 'express';
import { readFileSync } from 'node:fs';

const catalogo = JSON.parse(readFileSync(new URL('../data/medicamentos.json', import.meta.url), 'utf8'));

const normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const router = Router();

router.get('/', (req, res) => {
  const nombre = (req.query.nombre || '').trim();
  if (!nombre) {
    return res.status(400).json({ status: 400, error: 'Bad Request', mensaje: "Falta el parámetro 'nombre'" });
  }
  const buscado = normalizar(nombre);
  const resultado = catalogo.filter((m) =>
    normalizar(m.nombre).includes(buscado) || normalizar(m.principioActivo).includes(buscado));
  res.json(resultado);
});

export default router;
