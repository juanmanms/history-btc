import React from 'react';
import { Transaction } from '../interfaces/types'; // Importar la interfaz

interface SummaryProps {
    transactions: Transaction[]; // Usar la interfaz
}

const Summary: React.FC<SummaryProps> = ({ transactions }) => {
    const totals = transactions.reduce(
        (acc, tx) => ({
            euros: acc.euros + tx.euros,
            btc: acc.btc + tx.btc_amount,
            avgPrice: acc.euros / acc.btc,
        }),
        { euros: 0, btc: 0, avgPrice: 0 }
    );

    return (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resumen Total</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">Total Invertido</div>
                    <div className="text-lg font-semibold">{totals.euros.toLocaleString('es-ES')} €</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">Total BTC</div>
                    <div className="text-lg font-semibold">{totals.btc.toFixed(8)} BTC</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">Precio Medio de Compra</div>
                    <div className="text-lg font-semibold">{totals.avgPrice.toLocaleString('es-ES')} €</div>
                </div>
            </div>
        </div>
    );
};

export default Summary;