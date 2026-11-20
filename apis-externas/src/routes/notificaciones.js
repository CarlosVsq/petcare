import { Router } from 'express';
import nodemailer from 'nodemailer';

const CAMPOS = ['tipo', 'destinatario', 'cliente', 'mascota', 'veterinario', 'fecha', 'hora'];
const ACCIONES = { CONFIRMACION: 'confirmada', CANCELACION: 'cancelada' };

async function crearTransporte() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  const cuenta = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: cuenta.smtp.host,
    port: cuenta.smtp.port,
    secure: cuenta.smtp.secure,
    auth: { user: cuenta.user, pass: cuenta.pass },
  });
}

const router = Router();

router.post('/', async (req, res) => {
  const datos = req.body;
  const faltantes = CAMPOS.filter((campo) => !datos[campo]);
  if (faltantes.length > 0 || !ACCIONES[datos.tipo]) {
    return res.status(400).json({
      status: 400,
      error: 'Bad Request',
      mensaje: 'Datos de la notificación incompletos o tipo inválido',
      detalles: faltantes,
    });
  }

  const accion = ACCIONES[datos.tipo];
  try {
    const smtp = await crearTransporte();
    const info = await smtp.sendMail({
      from: `"Clínica Veterinaria PetCare" <${process.env.SMTP_USER || 'notificaciones@petcare.cl'}>`,
      to: datos.destinatario,
      subject: `PetCare: reserva ${accion}`,
      text: `Hola ${datos.cliente}:\n\nLe informamos que la reserva de ${datos.mascota} con ${datos.veterinario} `
        + `para el ${datos.fecha} a las ${datos.hora} ha sido ${accion}.\n\nClínica Veterinaria PetCare`,
    });
    const vistaPrevia = nodemailer.getTestMessageUrl(info);
    console.log(`Correo de ${datos.tipo} enviado a ${datos.destinatario}${vistaPrevia ? ` (${vistaPrevia})` : ''}`);
    res.status(202).json({ enviado: true, idMensaje: info.messageId });
  } catch (error) {
    console.error(`No se pudo enviar el correo a ${datos.destinatario}: ${error.message}`);
    res.status(502).json({ status: 502, error: 'Bad Gateway', mensaje: 'No se pudo enviar el correo' });
  }
});

export default router;
