import React, { useState } from 'react';
import { supabase } from '../supabase';
import { EuroIcon, Bitcoin, Wallet, Calendar } from 'lucide-react';

interface TransactionFormProps {
    onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
    const [euros, setEuros] = useState('');
    const [btcAmount, setBtcAmount] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [wallet, setWallet] = useState('Exchange');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('transactions').insert({
            euros: parseFloat(euros),
            btc_amount: parseFloat(btcAmount),
            purchase_price: parseFloat(purchasePrice),
            wallet,
            date,
        });

        if (error) console.error('Error inserting transaction:', error);
        else {
            onTransactionAdded();
            setEuros('');
            setBtcAmount('');
            setPurchasePrice('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad en Euros
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={euros}
                        onChange={(e) => setEuros(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                    />
                    <EuroIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de BTC
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={btcAmount}
                        onChange={(e) => setBtcAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00000000"
                        step="0.00000001"
                        min="0"
                        required
                    />
                    <Bitcoin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Compra (€)
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                    />
                    <EuroIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Exchange"
                    />
                    <Wallet className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                </label>
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <button
                type="submit"
                className="md:col-span-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Añadir Transacción
            </button>
        </form>
    );
};

export default TransactionForm;