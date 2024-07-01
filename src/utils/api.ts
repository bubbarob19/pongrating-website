import { getValidToken } from './auth';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
    skipAuth?: boolean; // New optional parameter to skip authentication
}

export async function apiRequest<T>(url: string, options?: RequestOptions): Promise<T> {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const headers: Record<string, string> = {
        ...defaultHeaders,
        ...(options?.headers || {}),
    };

    try {
        if (!options?.skipAuth) {
            const token = await getValidToken();
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:8080/${url}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json() as T;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`API request failed: ${error.message}`);
        } else {
            throw new Error('API request failed: Unknown error occurred');
        }
    }
}