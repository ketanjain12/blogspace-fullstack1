
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// Authentication Page
export default function AuthPage({ register = false }) {
    const { login, register: signUp } = useAuth();

    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // Handle Login / Registration
    const submit = async (event) => {
        event.preventDefault();

        setBusy(true);
        setError('');

        try {
            const user = register
                ? await signUp(
                    values.name,
                    values.email,
                    values.password
                )
                : await login(
                    values.email,
                    values.password
                );

            navigate(user.role === 'admin' ? '/admin' : '/');
        } catch (error) {
            console.error('Login error:', error);

            setError(
                error.response?.data?.message ||
                error.message ||
                'Unable to login. Please try again.'
            );
        } finally {
        setBusy(false);
    }
};

return (
    <div className="auth">
        <div className="authbox">

            {/* Authentication Visual Section */}
            <div className="authvisual">
                <Link className="brand white" to="/">
                    ▣ blogspace.
                </Link>

                <h1>
                    {register ? 'A fresh page.' : 'Make room for'}
                    <br />
                    <em>
                        {register
                            ? 'A new perspective.'
                            : 'the work that matters.'}
                    </em>
                </h1>

                <p>
                    A calmer way to read, learn and move your ideas forward.
                </p>
            </div>

            {/* Authentication Form Section */}
            <div className="authform">
                <small>
                    {register ? 'GET STARTED' : 'WELCOME BACK'}
                </small>

                <h2>
                    {register
                        ? 'Create your account'
                        : 'Sign in to BlogSpace'}
                </h2>

                <p>
                    {register
                        ? 'Join a community of curious readers.'
                        : 'Pick up right where you left off.'}
                </p>

                {/* Error Message */}
                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {/* Login / Registration Form */}
                <form onSubmit={submit}>
                    {register && (
                        <label>
                            Full name

                            <input
                                required
                                minLength="2"
                                value={values.name}
                                onChange={e =>
                                    setValues({
                                        ...values,
                                        name: e.target.value
                                    })
                                }
                            />
                        </label>
                    )}

                    <label>
                        Email address

                        <input
                            type="email"
                            required
                            value={values.email}
                            onChange={e =>
                                setValues({
                                    ...values,
                                    email: e.target.value
                                })
                            }
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            minLength="8"
                            required
                            value={values.password}
                            onChange={e =>
                                setValues({
                                    ...values,
                                    password: e.target.value
                                })
                            }
                        />
                    </label>

                    <button
                        className="btn primary full"
                        disabled={busy}
                    >
                        {busy
                            ? 'Please wait…'
                            : register
                                ? 'Create account'
                                : 'Sign in'} →
                    </button>
                </form>

                {/* Login / Registration Switch */}
                <p className="switch">
                    {register
                        ? 'Already have an account?'
                        : 'Don’t have an account?'}

                    {' '}

                    <Link to={register ? '/login' : '/register'}>
                        {register ? 'Sign in' : 'Create one'}
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}
