
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3 } from 'lucide-react';

export default function BlogPostCard({ post }) {
    return (
        <article className="card">
            <Link
                to={`/post/${post.slug}`}
                className="cover"
            >
                <img
                    src={post.cover_image}
                    alt={post.title}
                />
            </Link>

            <div className="cardbody">
                <span className="tag">
                    {post.category}
                </span>

                <span className="read">
                    <Clock3 size={13} />
                    {' '}{post.read_time} min read
                </span>

                <Link to={`/post/${post.slug}`}>
                    <h3>{post.title}</h3>
                </Link>

                <p>{post.excerpt}</p>

                <div className="cardfoot">
                    By {post.author_name || 'BlogSpace Team'}

                    <Link to={`/post/${post.slug}`}>
                        Read story ↗
                    </Link>
                </div>
            </div>
        </article>
    );
}
