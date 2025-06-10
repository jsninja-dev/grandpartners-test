import { http, HttpResponse } from 'msw';

const VALID_PIN = 123456;
const ANONYMOUS_USERS = new Map<string, { id: string; login_code: string }>();

export const handlers = [
  // Register with email
  http.post('/v1/user/register/email', async ({ request }) => {
    const { email, lang } = (await request.json()) as {
      email: string;
      lang: string;
    };

    if (!email.includes('@')) {
      return HttpResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid email format',
            details: [
              {
                field: 'email',
                message: 'Email address format is incorrect',
              },
            ],
          },
        },
        { status: 422 },
      );
    }

    return HttpResponse.json({ data: [] });
  }),

  // Login with email and PIN
  http.post('/v1/auth/login/email', async ({ request }) => {
    const { email, pincode } = (await request.json()) as {
      email: string;
      pincode: string;
    };

    if (pincode !== VALID_PIN.toString()) {
      return HttpResponse.json(
        {
          error: {
            code: 'WRONG_PIN_CODE',
            message: 'PIN code expired or missing',
          },
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      data: {
        session: Math.random().toString(36).substring(7),
      },
    });
  }),

  // Anonymous registration
  http.post('/v1/user/register/code', async () => {
    const login_code = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    const user = {
      id: '1',
      login_code,
      created_at: new Date().toISOString(),
    };

    ANONYMOUS_USERS.set(login_code, user);

    return HttpResponse.json({ user });
  }),

  // Login with access code
  http.post('/v1/auth/login/code', async ({ request }) => {
    const { login_code } = (await request.json()) as { login_code: string };

    if (!login_code || login_code.length !== 16) {
      return HttpResponse.json(
        {
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid login code format',
          },
        },
        { status: 401 },
      );
    }

    if (login_code !== '1234567890123456') {
      return HttpResponse.json(
        {
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Authentication error',
          },
        },
        { status: 401 },
      );
    }

    const user = ANONYMOUS_USERS.get(login_code);
    if (!user) {
      return HttpResponse.json(
        {
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Authentication error',
          },
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      data: {
        session: Math.random().toString(36).substring(7),
      },
    });
  }),
];
