import React from 'react';
import { Trash2 } from 'lucide-react';
import { Transaction } from '../interfaces/types';

interface TransactionItemProps {
    transaction: Transaction; // Usar la interfaz
    onDeleteTransaction: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDeleteTransaction }) => {
    return (
        <tr className="border-t border-gray-200">
            <td className="px-4 py-2 text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString('es-ES')}</td>
            <td className="px-4 py-2 text-right text-sm font-medium">{transaction.euros.toLocaleString('es-ES')} €</td>
            <td className="px-4 py-2 text-right text-sm">{transaction.btc_amount.toFixed(8)} BTC</td>
            <td className="px-4 py-2 text-right text-sm">{transaction.purchase_price.toLocaleString('es-ES')} €</td>
            <td className="px-4 py-2 text-left text-sm">{transaction.wallet}</td>
            <td className="px-4 py-2 text-center">
                <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
};

export default TransactionItem;