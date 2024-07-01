import Cookies from 'js-cookie';
import { apiRequest } from '@/utils/api';

const TOKEN_KEY = 'jwt_token';
const EMAIL_KEY = 'user_email';
const PASSWORD_KEY = 'user_password';

export function setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // Set cookie for 1 day
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
    Cookies.remove(TOKEN_KEY);
}

export function setUserCredentials(email: string, password: string) {
    Cookies.set(EMAIL_KEY, email, { expires: 1 });
    Cookies.set(PASSWORD_KEY, password, { expires: 1 });
}

export function removeUserCredentials() {
    Cookies.remove(EMAIL_KEY);
    Cookies.remove(PASSWORD_KEY);
}

export async function authenticate() {
    const email = Cookies.get(EMAIL_KEY);
    const password = Cookies.get(PASSWORD_KEY);

    if (!email || !password) {
        throw new Error('Missing email or password.');
    }

    try {
        const response = await apiRequest<{ token: string }>('api/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        setToken(response.token);
        return response.token;
    } catch (error) {
        throw new Error('Authentication failed.');
    }
}

export async function getValidToken(): Promise<string> {
    let token = getToken();

    if (!token) {
        token = await authenticate();
    } else {
        try {
            const response = await apiRequest<{ valid: boolean }>('api/auth/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.valid) {
                token = await authenticate();
            }
        } catch {
            token = await authenticate();
        }
    }

    return token;
}
