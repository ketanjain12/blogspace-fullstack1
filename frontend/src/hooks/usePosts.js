
import { useEffect, useState } from 'react';

import api from '../services/api';

// Custom hook to fetch posts
export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch posts from API
    useEffect(() => {
        let active = true;

        api.get('/posts')
            .then(r => {
                if (active) {
                    setPosts(r.data.posts || []);
                }
            })
            .catch(() => {
                if (active) {
                    setError('Unable to load stories right now.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return {
        posts,
        loading,
        error
    };
}
