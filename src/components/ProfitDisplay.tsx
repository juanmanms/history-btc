import React from 'react';
import { Transaction } from '../interfaces/types';

interface ProfitDisplayProps {
    transactions: Transaction[]; // Usar la interfaz
    currentBTCPrice: number;
}

const ProfitDisplay: React.FC<ProfitDisplayProps> = ({ transactions, currentBTCPrice }) => {
    const totalProfit = transactions.reduce((acc, tx) => acc + (tx.btc_amount * currentBTCPrice - tx.euros), 0);
    const totalInvested = transactions.reduce((acc, tx) => acc + tx.euros, 0);
    const profitPercentage = totalInvested === 0 ? 0 : (totalProfit / totalInvested) * 100;

    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">Beneficio Total</h2>
                    <span className={`text-sm font-medium ${profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({profitPercentage.toFixed(2)}%)
                    </span>
                </div>
                <span className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalProfit.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
            </div>
        </div>
    );
};

export default ProfitDisplay;