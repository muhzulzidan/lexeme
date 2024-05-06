import Link from 'next/link';
import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <div>
            <header className="animate-header-slide-down-fade sticky top-0 border-b border-transparent backdrop-blur-sm transition duration-200 ease-in-out z-10">
                <div className="mx-auto w-full max-w-5xl px-6 md:max-w-7xl">
                    <div className="mx-auto hidden h-[58px] w-full items-center justify-between transition duration-500 ease-in-out md:flex">
                        <div className="flex lg:w-[225px]">
                            <Link className="focus-visible:ring-slate-7 py-1 outline-none transition duration-150 ease-in-out focus-visible:ring-2 text-2xl font-semibold" aria-label="Resend" href="/">Lexeme</Link>
                        </div>
                        <div className="flex gap-4">
                            <Link className="inline-flex h-10 select-none items-center justify-center gap-0 rounded-lg border border-gray-800 hover:border-sky-900 hover:bg-sky-900 bg-gray-900 text-white px-4 text-sm font-semibold outline-none transition duration-150 duration-200 ease-in-out ease-in-out" href="/editor">Try Lexeme</Link>
                            <Link className="inline-flex h-10 select-none items-center justify-center gap-0 rounded-lg border border-gray-300 hover:border-gray-200 hover:bg-gray-200 bg-white px-4 text-sm font-semibold outline-none transition duration-150 duration-200 ease-in-out ease-in-out" href="https://github.com/pagebrain/lexeme" target="_blank">Github</Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl h-screen flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-lg w-11/12">The page you are looking for does not exist.</p>
                <div className='md:hidden flex gap-4 flex-col md:flex-row'>
                    <Link className="inline-block text-2xl justify-center mt-4 py-4 px-6 transition-colors border border-gray-800 hover:border-sky-900 hover:bg-sky-900 bg-gray-900 text-white rounded-lg mr-4" href="/editor">Try Lexeme</Link>
                    <Link className="inline-block text-2xl justify-center mt-4 py-4 px-6 transition-colors border border-gray-300 hover:border-gray-200 hover:bg-gray-200 bg-white rounded-lg" href="https://github.com/pagebrain/lexeme" target="_blank">Github</Link>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;