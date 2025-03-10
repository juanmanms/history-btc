import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <img src="https://firebasestorage.googleapis.com/v0/b/botigas-7c71f.appspot.com/o/juanmanms.com%2Fproyectos%2FlogoHMCsolo.png?alt=media&token=08bbc7f9-b50f-4a30-8b5d-354724cb08a0" alt="Logo" className="w-8 h-8" />
                    <span className="hidden md:block">HMC</span>
                </h1>
                <div className="flex flex-wrap items-center gap-4">

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;