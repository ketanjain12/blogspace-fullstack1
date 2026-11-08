
import React from 'react';
import { Megaphone } from 'lucide-react';

export default function AdPlaceholder({
    placement = 'sidebar'
}) {
    return (
        <div className="ad-placeholder">
            <Megaphone size={18} />

            <strong>Sponsored space</strong>

            <span>
                {placement.replaceAll('_', ' ')}
            </span>
        </div>
    );
}
