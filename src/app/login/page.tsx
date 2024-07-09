'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {
    register,
    removeToken,
    removeUserEmail,
    getValidToken,
    authenticate, removeRefreshToken, removePlayerId
} from '@/utils/auth';
import { apiRequest } from '@/utils/api';

const LoginPage = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regInviteCode, setRegInviteCode] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check if user is already logged in
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getValidToken();
                if (token)
                    setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false)
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // Function to handle login
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await authenticate(loginEmail, loginPassword);
            handleLoginSuccess();
        } catch (err) {
            // @ts-ignore
            setError(err.message as string);
        }
    };

    // Function to handle registration
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(regFirstName, regLastName, regEmail, regPassword, regInviteCode);
            handleLoginSuccess();
        } catch (err) {
            // @ts-ignore
            setError(err.message as string);
        }
    };

    // Function to handle successful login or registration
    const handleLoginSuccess = () => {
        localStorage.setItem('successMessage', 'You are now logged in!');
        router.push('/');
    };

    // Function to handle sign-out
    const handleLogout = () => {
        removeToken();
        removeUserEmail();
        removeRefreshToken();
        removePlayerId();

        localStorage.setItem('successMessage', 'You logged out successfully!');
        router.push('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            {/* Conditional rendering based on login status */}
            {isLoggedIn ? (
                <div className="bg-white p-8 rounded shadow-md w-80">
                    <h2 className="text-2xl font-bold mb-4">Signed In</h2>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <>
                    {/* Login Box */}
                    <div className="bg-white p-8 rounded shadow-md w-80 mr-4">
                        <h2 className="text-2xl font-bold mb-4">Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Login
                            </button>
                        </form>
                    </div>

                    {/* Registration Box */}
                    <div className="bg-white p-8 rounded shadow-md w-80 ml-4">
                        <h2 className="text-2xl font-bold mb-4">Register</h2>
                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={regFirstName}
                                onChange={(e) => setRegFirstName(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={regLastName}
                                onChange={(e) => setRegLastName(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Invitation Code"
                                value={regInviteCode}
                                onChange={(e) => setRegInviteCode(e.target.value)}
                                required
                                className="w-full px-3 py-2 mb-3 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4 ml-4">{error}</p>}
        </div>
    );
};

export default LoginPage;