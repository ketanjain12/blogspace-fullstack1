
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import api from '../services/api';
import AdPlaceholder from '../components/AdPlaceholder';

// Post Detail Page
export default function PostDetailPage() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    // Fetch Post Details
    useEffect(() => {
        let active = true;

        api.get(`/posts/${slug}`)
            .then(r => {
                if (active) {
                    setPost(r.data.post);
                }
            })
            .catch(e => {
                if (active) {
                    setError(
                        e.response?.data?.message || 'Story unavailable'
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [slug]);

    // Display Error
    if (error) {
        return (
            <div className="empty">
                {error}
            </div>
        );
    }

    // Display Loading State
    if (!post) {
        return (
            <div className="empty">
                Loading story…
            </div>
        );
    }

    return (
        <article className="article">

            {/* Back Navigation */}
            <Link
                className="back"
                to="/"
            >
                <ArrowLeft size={16} />
                All stories
            </Link>

            {/* Article Header */}
            <div className="article-head">
                <span className="tag">
                    {post.category}
                </span>

                <h1>{post.title}</h1>

                <p>{post.excerpt}</p>

                <small>
                    By {post.author_name} · {post.read_time} min read
                </small>
            </div>

            {/* Article Cover Image */}
            <img
                className="article-img"
                src={post.cover_image}
                alt={post.title}
            />

            {/* Article Content Layout */}
            <div className="article-layout">

                {/* Main Article Content */}
                <div className="article-text">
                    {post.content.split(/\n+/).map((line, index) => (
                        <p key={index}>
                            {line}
                        </p>
                    ))}

                    {/* In-Content Advertisement */}
                    <AdPlaceholder placement="in_content_1" />
                </div>

                {/* Sidebar Advertisement */}
                <aside className="article-sidebar">
                    <AdPlaceholder placement="sidebar" />
                </aside>
            </div>
        </article>
    );
}
