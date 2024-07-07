import Cookies from 'js-cookie';
import {apiRequest} from '@/utils/api';

const TOKEN_KEY = 'jwt_token';
const EMAIL_KEY = 'user_email';
const PASSWORD_KEY = 'user_password';
const PLAYER_ID_KEY = 'player_id'

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

export function setPlayerId(id: string) {
    Cookies.set(PLAYER_ID_KEY, id, { expires: 1 });
}

export function getPlayerId() {
    return Cookies.get(PLAYER_ID_KEY);
}

export function removeUserCredentials() {
    Cookies.remove(EMAIL_KEY);
    Cookies.remove(PASSWORD_KEY);
}

export async function authenticate() {
    const email = Cookies.get(EMAIL_KEY);
    const password = Cookies.get(PASSWORD_KEY);

    if (!email || !password) {
        throw new Error('Authentication failed.');
    }

    try {
        const response = await apiRequest<{ token: string, playerId: string }>('api/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });

        setToken(response.token);
        setPlayerId(response.playerId);
        return response.token;
    } catch (error) {
        throw new Error('Authentication failed.');
    }
}

export async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    inviteCode: string)
{
    const response = await apiRequest<{ token: string }>('api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            inviteCode: inviteCode,
        }),
        skipAuth: true
    });
    return response.token;
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
                },
                skipAuth: true
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
