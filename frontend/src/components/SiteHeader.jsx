import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function SiteHeader() {
    const { user, logout } = useAuth();

    const [menu, setMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu whenever route changes
    useEffect(() => {
        setMenu(false);
    }, [location.pathname]);

    const closeMenu = () => setMenu(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <>
            <header className="header">
                
                <Link
                    to="/"
                    className="brand"
                    onClick={closeMenu}
                >
                    <span className="mark">
                        <BookOpen />
                    </span>
                    blogspace
                    <span>.</span>
                </Link>

                <nav>
                    <Link to="/">Discover</Link>
                    <a href="/#stories">Latest stories</a>
                    <a href="/#about">About</a>
                </nav>

                <div className="head-actions">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link
                                    className="btn light"
                                    to="/admin"
                                >
                                    Admin
                                </Link>
                            )}

                            <span className="welcome">
                                Hi, {user.name?.split(' ')[0]}
                            </span>

                            <button
                                className="btn light"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                className="btn light"
                                to="/login"
                            >
                                Log in
                            </Link>

                            <Link
                                className="btn primary"
                                to="/register"
                            >
                                Join BlogSpace ↗
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="mobile-toggle"
                    onClick={() => setMenu(prev => !prev)}
                    aria-label={menu ? 'Close menu' : 'Open menu'}
                    aria-expanded={menu}
                >
                    {menu ? <X /> : <Menu />}
                </button>
            </header>

            {/* Mobile Navigation */}
            {menu && (
                <div className="mobile-menu">
                    <Link to="/" onClick={closeMenu}>
                        Discover
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={closeMenu}
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            <span className="welcome">
                                Hi, {user.name?.split(' ')[0]}
                            </span>

                            <button
                                type="button"
                                className="btn light"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                Log in
                            </Link>

                            <Link
                                to="/register"
                                onClick={closeMenu}
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
