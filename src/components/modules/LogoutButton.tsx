import React from 'react';

export interface LogoutButtonProps {
    onLogout?: () => void;
    className?: string;
    variant?: 'button' | 'icon';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    onLogout,
    className = '',
    variant = 'button',
}) => {
    const handleLogout = () => {
        // Clear any local authentication state/tokens if needed
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Call custom handler or redirect
        if (onLogout) {
            onLogout();
        } else {
            window.location.href = '/login';
        }
    };

    if (variant === 'icon') {
        return (
            <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                className={`p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ${className}`}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-colors ${className}`}
        >
            <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
            <span>Log Out</span>
        </button>
    );
};

export default LogoutButton;