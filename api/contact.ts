// Endpoint serverless preparado para Vercel Functions (/api/contact).
// Mientras VAC_CONTACT_ENABLED !== 'true', rechaza envíos reales de forma segura
// y nunca almacena ni reenvía datos personales en el prototipo.

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (data: unknown) => void;
}

const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,22}$/;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ status: 'server_error', message: 'Método no permitido.' });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = Array.isArray(forwarded)
    ? forwarded[0]
    : (forwarded?.split(',')[0]?.trim() ?? 'unknown');

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      status: 'server_error',
      message: 'Demasiadas solicitudes en poco tiempo. Intente nuevamente en un minuto.',
    });
    return;
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<string, unknown>;
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const honeypot = typeof body.honeypot === 'string' ? body.honeypot.trim() : '';

  if (honeypot.length > 0) {
    res.status(400).json({ status: 'validation_error', message: 'Solicitud inválida.' });
    return;
  }

  const errors: Record<string, string> = {};
  if (fullName.length < 3) errors.fullName = 'Nombre requerido (mínimo 3 caracteres).';
  if (!EMAIL_RE.test(email)) errors.email = 'Correo electrónico inválido.';
  if (phone.length > 0 && !PHONE_RE.test(phone)) errors.phone = 'Formato de teléfono inválido.';
  if (message.length < 15) errors.message = 'Mensaje requerido (mínimo 15 caracteres).';

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      status: 'validation_error',
      message: 'Revise los campos marcados.',
      errors,
    });
    return;
  }

  const contactEnabled = process.env.VAC_CONTACT_ENABLED === 'true';
  if (!contactEnabled) {
    res.status(503).json({
      status: 'prototype_disabled',
      message:
        'Recepción desactivada en entorno prototipo. Confirmar VAC_CONTACT_ENABLED y buzón oficial con Vergez & Asociados.',
    });
    return;
  }

  // Punto de integración autorizado (ej. Resend / SMTP / webhook protegido por secreto de entorno)
  res.status(501).json({
    status: 'server_error',
    message: 'Adaptador de correo autorizado pendiente de credenciales de proveedor.',
  });
}
