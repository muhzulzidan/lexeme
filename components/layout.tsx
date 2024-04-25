import React from 'react';
import { Toaster } from "@/components/ui/toaster"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <main>
                {children}
            </main>
            <Toaster />
        </>
    );
};

export default Layout;