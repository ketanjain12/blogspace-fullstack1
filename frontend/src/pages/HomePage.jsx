
import React, { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

import { usePosts } from '../hooks/usePosts';
import BlogPostCard from '../components/BlogPostCard';
import GoogleTestAd from '../components/GoogleTestAd';

// Home Page
export default function HomePage() {
    const { posts, loading, error } = usePosts();

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');

    // Available Categories
    const categories = [
        'All',
        'Lifestyle',
        'Writing',
        'Productivity',
        'Technology',
        'Design'
    ];

    // Filter Posts
    const filtered = useMemo(
        () => posts.filter(
            p =>
                (category === 'All' || p.category === category) &&
                `${p.title} ${p.excerpt}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
        ),
        [posts, category, query]
    );

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div>
                    <div className="eyebrow">
                        ✦ &nbsp; A JOURNAL FOR CURIOUS MINDS
                    </div>

                    <h1>
                        Ideas worth
                        <br />
                        <em>spending time on.</em>
                    </h1>

                    <p>
                        Thoughtful stories, practical ideas and fresh
                        perspectives to help you make more of every day.
                    </p>

                    <a
                        className="btn primary big"
                        href="#stories"
                    >
                        Explore stories
                        <ArrowRight size={17} />
                    </a>

                    <div className="hero-meta">
                        ✧ Fresh perspectives　　✧ Ideas that move you
                    </div>
                </div>

                <div className="hero-art">
                    <img
                        src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85"
                        alt="Writing desk"
                    />

                    <div className="float">
                        ✦ &nbsp; Make space for ideas
                        <br />
                        <small>
                            One good thought at a time.
                        </small>
                    </div>
                </div>
            </section>

            {/* Top Advertisement */}
            <GoogleTestAd placement="home-top-ad" />

            {/* Stories Section */}
            <section
                id="stories"
                className="stories"
            >
                <div className="kicker">
                    THE READING ROOM
                </div>

                <h2>
                    Stories to explore<span>.</span>
                </h2>

                {/* Search and Category Filters */}
                <div className="tools">
                    <div className="search">
                        <Search />

                        <input
                            placeholder="Search stories..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        {categories.map(item => (
                            <button
                                key={item}
                                className={category === item ? 'chosen' : ''}
                                onClick={() => setCategory(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Middle Advertisement */}
                <GoogleTestAd placement="home-middle-ad" />

                {/* Posts Loading / Error / Posts List */}
                {loading ? (
                    <p className="empty">
                        Loading stories…
                    </p>
                ) : error ? (
                    <p className="empty">
                        {error}
                    </p>
                ) : (
                    <div className="grid">
                        {filtered.map(post => (
                            <BlogPostCard
                                key={post.id}
                                post={post}
                            />
                        ))}
                    </div>
                )}

                {/* Empty Search Result */}
                {!loading && !error && !filtered.length && (
                    <p className="empty">
                        No stories found. Try another search.
                    </p>
                )}

                {/* Bottom Advertisement */}
                <GoogleTestAd placement="home-bottom-ad" />
            </section>

            {/* About Section */}
            <section
                id="about"
                className="about"
            >
                <div>
                    <small>WHY BLOGSPACE</small>

                    <h2>
                        Good ideas deserve
                        <br />
                        a little more space.
                    </h2>
                </div>

                <p>
                    A calm corner of the internet for useful knowledge,
                    honest perspectives and stories that stay with you.
                    Take a breath, find a new idea, and keep exploring.
                </p>
            </section>
        </>
    );
}
