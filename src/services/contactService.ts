export interface ContactPayload {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  honeypot?: string;
}

export type ContactValidationErrors = Partial<Record<'fullName' | 'email' | 'phone' | 'message', string>>;

export interface ContactSubmissionResult {
  status: 'prototype_disabled' | 'sent' | 'validation_error' | 'server_error';
  message: string;
  errors?: ContactValidationErrors;
}

export interface ContactTransportProvider {
  readonly mode: 'prototype' | 'production_api';
  submit(payload: ContactPayload): Promise<ContactSubmissionResult>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{7,22}$/;

export function validateContactPayload(payload: ContactPayload): ContactValidationErrors {
  const errors: ContactValidationErrors = {};
  const name = payload.fullName.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();
  const message = payload.message.trim();

  if (name.length < 3) {
    errors.fullName = 'Ingrese su nombre completo (mínimo 3 caracteres).';
  }
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Ingrese una dirección de correo electrónico válida.';
  }
  if (phone.length > 0 && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'El teléfono solo puede incluir dígitos, espacios, guiones, paréntesis o signo +.';
  }
  if (message.length < 15) {
    errors.message = 'Describa brevemente su proyecto o consulta (mínimo 15 caracteres).';
  }

  return errors;
}

/**
 * Proveedor de demostración seguro: valida datos localmente pero bloquea todo
 * envío o almacenamiento mientras VAC no confirme su buzón receptor y política de privacidad.
 */
export class PrototypeSafeContactProvider implements ContactTransportProvider {
  public readonly mode = 'prototype' as const;

  public async submit(payload: ContactPayload): Promise<ContactSubmissionResult> {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      return {
        status: 'prototype_disabled',
        message: 'Solicitud descartada por control antispam.',
      };
    }

    const errors = validateContactPayload(payload);
    if (Object.keys(errors).length > 0) {
      return {
        status: 'validation_error',
        message: 'Revise los campos marcados antes de continuar.',
        errors,
      };
    }

    return {
      status: 'prototype_disabled',
      message:
        'Validación local correcta. El envío real permanece desactivado en este prototipo: ningún dato ha sido enviado ni almacenado. Comuníquese directamente al 809-688-4418 o a I.verguez@vac.com.do.',
    };
  }
}

/**
 * Proveedor listo para activación en producción tras confirmar correo receptor,
 * secretos de entorno y aviso de privacidad aprobado por VAC.
 */
export class ApiEndpointContactProvider implements ContactTransportProvider {
  public readonly mode = 'production_api' as const;
  private readonly endpoint: string;

  constructor(endpoint = '/api/contact') {
    this.endpoint = endpoint;
  }

  public async submit(payload: ContactPayload): Promise<ContactSubmissionResult> {
    const errors = validateContactPayload(payload);
    if (Object.keys(errors).length > 0) {
      return {
        status: 'validation_error',
        message: 'Revise los campos marcados antes de enviar.',
        errors,
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as Partial<ContactSubmissionResult>;
      if (!response.ok) {
        return {
          status: data.status ?? 'server_error',
          message: data.message ?? 'No fue posible procesar la solicitud en el servidor.',
          errors: data.errors,
        };
      }
      return {
        status: data.status ?? 'sent',
        message: data.message ?? 'Consulta recibida.',
      };
    } catch {
      return {
        status: 'server_error',
        message: 'Error de conexión al intentar validar la solicitud.',
      };
    }
  }
}

export const contactService: ContactTransportProvider = new PrototypeSafeContactProvider();
