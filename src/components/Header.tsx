import React from 'react';
import { Bitcoin, LogOut } from 'lucide-react';

interface HeaderProps {
    currentBTCPrice: number;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentBTCPrice, onLogout }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bitcoin className="text-yellow-500 block" />
                    <span className="hidden md:block">Calculadora de Beneficios Bitcoin</span>
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-sm text-gray-600">Precio actual:</span>
                        <span className="font-bold">{currentBTCPrice.toLocaleString('es-ES')} €</span>
                    </div>
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