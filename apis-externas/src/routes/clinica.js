import { Router } from 'express';
import { readFileSync } from 'node:fs';

const clinica = JSON.parse(readFileSync(new URL('../data/clinica.json', import.meta.url), 'utf8'));

const router = Router();

router.get('/ubicacion', (req, res) => {
  res.json(clinica);
});

export default router;
