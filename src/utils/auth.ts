import Cookies from 'js-cookie';
import {apiRequest} from '@/utils/api';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EMAIL_KEY = 'user_email';
const PLAYER_ID_KEY = 'player_id';

export function setToken(token: string) {
    Cookies.set(TOKEN_KEY, token);
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
    Cookies.remove(TOKEN_KEY);
}

export function setRefreshToken(refreshToken: string) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
}

export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
}

export function removeRefreshToken() {
    Cookies.remove(REFRESH_TOKEN_KEY);
}

export function setUserEmail(email: string) {
    Cookies.set(EMAIL_KEY, email, { expires: 1 });
}

export function getUserEmail(): string | undefined {
    return Cookies.get(EMAIL_KEY);
}

export function setPlayerId(id: string) {
    Cookies.set(PLAYER_ID_KEY, id, { expires: 1 });
}

export function getPlayerId(): string | undefined {
    return Cookies.get(PLAYER_ID_KEY);
}

export function removeUserEmail() {
    Cookies.remove(EMAIL_KEY);
}

export function removePlayerId() {
    Cookies.remove(PLAYER_ID_KEY);
}

export async function authenticate(email: string, password: string) {
    try {
        const response = await apiRequest<AuthResponse>('api/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });

        setToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUserEmail(email);
        setPlayerId(response.playerId);

        return response;
    } catch (error) {
        throw new Error('Authentication failed.');
    }
}

export async function refreshToken() {
    const refreshToken = getRefreshToken();
    const email = getUserEmail();

    if (!refreshToken || !email) {
        throw new Error('Refresh token is missing.');
    }

    try {
        const response = await apiRequest<AuthResponse>('api/auth/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, refreshToken }),
            skipAuth: true,
        });

        setToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setPlayerId(response.playerId)
        setUserEmail(email);

        return response;
    } catch (error) {
        throw new Error('Token refresh failed. Please log in again.');
    }
}

export async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    inviteCode: string
) {
    const response = await apiRequest<AuthResponse>('api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            inviteCode,
        }),
        skipAuth: true,
    });

    setToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setPlayerId(response.playerId)
    setUserEmail(email);

    return response;
}

export async function getValidToken(): Promise<string | undefined> {
    let token = getToken();

    try {
        if (!token) {
            token = (await refreshToken()).accessToken;
        } else {
            try {
                const response = await apiRequest<{ valid: boolean }>('api/auth/validate-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    skipAuth: true,
                });

                if (!response.valid) {
                    (await refreshToken()).accessToken;
                }
            } catch {
                (await refreshToken()).accessToken;
            }
        }
    } catch (error) {
        token = undefined
    }

    return token;
}