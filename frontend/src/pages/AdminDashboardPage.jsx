import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Plus, Trash2, X } from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyPostForm = {
    title: '',
    excerpt: '',
    content: '',
    category: 'Lifestyle',
    cover_image: '',
    status: 'draft',
};

const emptyUserForm = {
    name: '',
    email: '',
};

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState({});
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [postForm, setPostForm] = useState(emptyPostForm);

    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState(emptyUserForm);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);

    // Load dashboard data
    const load = async () => {
        try {
            setError('');

            const [
                statsResponse,
                postsResponse,
                usersResponse,
            ] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/posts'),
                api.get('/admin/users'),
            ]);

            setStats(statsResponse.data.stats);
            setPosts(statsResponse.data ? postsResponse.data.posts : []);

            // Show only normal users
            setUsers(
                usersResponse.data.users.filter(
                    (item) => item.role === 'user'
                )
            );
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to load admin data.'
            );
        }
    };

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/', { replace: true });
            return;
        }

        load();
    }, [user]);

    // Save post
    const savePost = async (event) => {
        event.preventDefault();

        setBusy(true);
        setError('');

        try {
            if (editingPost) {
                await api.put(
                    `/admin/posts/${editingPost}`,
                    postForm
                );
            } else {
                await api.post('/admin/posts', postForm);
            }

            setShowPostForm(false);
            setEditingPost(null);
            setPostForm(emptyPostForm);

            setSuccess('Post saved successfully.');
            await load();
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to save post.'
            );
        } finally {
            setBusy(false);
        }
    };

    // Delete post
    const removePost = async (id) => {
        if (!window.confirm('Delete this post?')) return;

        try {
            await api.delete(`/admin/posts/${id}`);

            setSuccess('Post deleted successfully.');
            await load();
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to delete post.'
            );
        }
    };

    // Open user editor
    const openUserEditor = (item) => {
        setEditingUser(item);

        setUserForm({
            name: item.name || '',
            email: item.email || '',
        });

        setError('');
        setSuccess('');
    };

    // Save user changes
    const saveUser = async (event) => {
        event.preventDefault();

        if (!editingUser) return;

        setBusy(true);
        setError('');
        setSuccess('');

        try {
            await api.put(
                `/admin/users/${editingUser.id}`,
                {
                    name: userForm.name.trim(),
                    email: userForm.email.trim().toLowerCase(),
                }
            );

            setEditingUser(null);
            setUserForm(emptyUserForm);

            setSuccess('User details updated successfully.');

            await load();
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to update user.'
            );
        } finally {
            setBusy(false);
        }
    };

    // Activate / Disable user
    const toggleUserStatus = async (item) => {
        try {
            await api.put(
                `/admin/users/${item.id}`,
                {
                    is_active: !Boolean(item.is_active),
                }
            );

            setSuccess(
                `User ${item.is_active ? 'disabled' : 'activated'} successfully.`
            );

            await load();
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to update user status.'
            );
        }
    };

    // Delete user
    const removeUser = async (id) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this user?'
            )
        ) {
            return;
        }

        try {
            await api.delete(`/admin/users/${id}`);

            setSuccess('User deleted successfully.');
            await load();
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                'Unable to delete user.'
            );
        }
    };

    return (
        <div className="admin">
            <aside>
                <Link className="brand white" to="/">
                    ▣ blogspace.
                </Link>

                <small>WORKSPACE</small>

                {[
                    ['overview', '▦ Overview'],
                    ['posts', '▤ Posts'],
                    ['users', '♙ Users'],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        className={tab === key ? 'active' : ''}
                        onClick={() => setTab(key)}
                    >
                        {label}
                    </button>
                ))}

                <button
                    className="signout"
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                >
                    ↗ Sign out
                </button>
            </aside>

            <main>
                <header>
                    <div>
                        <small>BLOGSPACE / ADMIN</small>
                        <h1>
                            {tab === 'overview'
                                ? 'Overview'
                                : tab === 'posts'
                                    ? 'Posts'
                                    : 'Users'}
                        </h1>
                    </div>

                    <span>{user?.name}</span>
                </header>

                {error && (
                    <p className="error" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="success" role="status">
                        {success}
                    </p>
                )}

                {tab === 'overview' && (
                    <>
                        <h2>
                            Good to see you, {user?.name?.split(' ')[0]}.
                        </h2>

                        <div className="stats">
                            {[
                                ['Readers', stats.users],
                                ['All posts', stats.posts],
                                ['Published', stats.published],
                                ['Drafts', stats.drafts],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <small>{label}</small>
                                    <b>{value ?? '—'}</b>
                                </div>
                            ))}
                        </div>

                        <div className="panel">
                            <h3>Recent stories</h3>

                            {posts.slice(0, 5).map((post) => (
                                <p className="row" key={post.id}>
                                    {post.title}
                                    <span>{post.status}</span>
                                </p>
                            ))}
                        </div>
                    </>
                )}

                {tab === 'posts' && (
                    <>
                        <div className="between">
                            <h2>Manage stories</h2>

                            <button
                                className="btn primary"
                                onClick={() => {
                                    setEditingPost(null);
                                    setPostForm(emptyPostForm);
                                    setShowPostForm((current) => !current);
                                }}
                            >
                                <Plus size={16} /> New post
                            </button>
                        </div>

                        {showPostForm && (
                            <form
                                className="panel editor"
                                onSubmit={savePost}
                            >
                                <h3>
                                    {editingPost ? 'Edit post' : 'Create post'}
                                </h3>

                                {[
                                    ['title', 'Title'],
                                    ['excerpt', 'Excerpt'],
                                    ['cover_image', 'Cover image URL'],
                                    ['content', 'Content'],
                                ].map(([key, label]) => (
                                    <label key={key}>
                                        {label}

                                        {key === 'content' || key === 'excerpt' ? (
                                            <textarea
                                                required
                                                value={postForm[key] || ''}
                                                onChange={(event) =>
                                                    setPostForm({
                                                        ...postForm,
                                                        [key]: event.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <input
                                                required={key !== 'cover_image'}
                                                value={postForm[key] || ''}
                                                onChange={(event) =>
                                                    setPostForm({
                                                        ...postForm,
                                                        [key]: event.target.value,
                                                    })
                                                }
                                            />
                                        )}
                                    </label>
                                ))}

                                <label>
                                    Status

                                    <select
                                        value={postForm.status}
                                        onChange={(event) =>
                                            setPostForm({
                                                ...postForm,
                                                status: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </label>

                                <button
                                    className="btn primary"
                                    disabled={busy}
                                >
                                    {busy ? 'Saving…' : 'Save post'}
                                </button>
                            </form>
                        )}

                        <div className="panel">
                            {posts.map((post) => (
                                <div className="row" key={post.id}>
                                    <b>{post.title}</b>
                                    <span>{post.status}</span>

                                    <button
                                        aria-label={`Edit ${post.title}`}
                                        onClick={() => {
                                            setEditingPost(post.id);
                                            setPostForm({
                                                ...emptyPostForm,
                                                ...post,
                                            });
                                            setShowPostForm(true);
                                        }}
                                    >
                                        <Edit3 size={15} />
                                    </button>

                                    <button
                                        aria-label={`Delete ${post.title}`}
                                        onClick={() => removePost(post.id)}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {tab === 'users' && (
                    <div className="panel">
                        <h2>Community users</h2>

                        {editingUser && (
                            <form
                                className="editor user-editor"
                                onSubmit={saveUser}
                            >
                                <div className="between">
                                    <h3>Edit user</h3>

                                    <button
                                        type="button"
                                        aria-label="Close edit form"
                                        onClick={() => setEditingUser(null)}
                                    >
                                        <X size={17} />
                                    </button>
                                </div>

                                <label>
                                    Full name

                                    <input
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        value={userForm.name}
                                        onChange={(event) =>
                                            setUserForm({
                                                ...userForm,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <label>
                                    Email address

                                    <input
                                        required
                                        type="email"
                                        value={userForm.email}
                                        onChange={(event) =>
                                            setUserForm({
                                                ...userForm,
                                                email: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <div className="between">
                                    <button
                                        type="button"
                                        className="btn light"
                                        onClick={() => setEditingUser(null)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn primary"
                                        disabled={busy}
                                    >
                                        {busy ? 'Saving…' : 'Save changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {users.length === 0 ? (
                            <p className="empty">
                                No registered users found.
                            </p>
                        ) : (
                            users.map((item) => (
                                <div className="row user-row" key={item.id}>
                                    <div className="user-details">
                                        <b>{item.name}</b>
                                        <small>{item.email}</small>
                                    </div>

                                    <span>
                                        {item.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                    <button
                                        onClick={() => toggleUserStatus(item)}
                                    >
                                        {item.is_active ? 'Disable' : 'Activate'}
                                    </button>
                                    <button
                                        aria-label={`Edit ${item.name}`}
                                        onClick={() => openUserEditor(item)}
                                    >
                                        {/* <Edit3 size={15} /> Edit */}
                                        <Edit3 size={15} />
                                    </button>



                                    <button
                                        aria-label={`Delete ${item.name}`}
                                        onClick={() => removeUser(item.id)}
                                    >
                                        {/* <Trash2 size={15} /> Delete */}
                                        <Trash2 size={15} /> 
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
