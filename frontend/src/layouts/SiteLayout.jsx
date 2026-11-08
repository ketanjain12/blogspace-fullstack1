
import React from 'react';
import { Outlet } from 'react-router-dom';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

// Main Site Layout
export default function SiteLayout() {
    return (
        <div className="shell">
            <SiteHeader />

            <main>
                <Outlet />
            </main>

            <SiteFooter />
        </div>
    );
}
