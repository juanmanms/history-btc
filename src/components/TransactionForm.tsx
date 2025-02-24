import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { EuroIcon, Bitcoin, Wallet, Calendar } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import debounce from 'lodash/debounce';
import { Crypto } from '../interfaces/types';


interface TransactionFormProps {
    onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
    const [calculatorInputs, setCalculatorInputs] = useState({
        euros: '',
        btcAmount: '',
        purchasePrice: '',
    });
    const [wallet, setWallet] = useState('Exchange');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [cryptoId, setCryptoId] = useState<number | null>(1);
    const [cryptos, setCryptos] = useState<Crypto[]>([]);

    useEffect(() => {
        const fetchCryptos = async () => {
            const { data, error } = await supabase.from('cryptos').select('*');
            if (error) console.error('Error fetching cryptos:', error);
            else setCryptos(data);
        };

        fetchCryptos();
    }, []);

    // Función para manejar el cálculo con debounce
    const handleCalculation = debounce(() => {
        const { euros, btcAmount, purchasePrice } = calculatorInputs;

        const eurosNum = parseFloat(euros) || 0;
        const btcNum = parseFloat(btcAmount) || 0;
        const priceNum = parseFloat(purchasePrice) || 0;

        // Contar cuántos campos están correctamente llenados
        const filledValues = [eurosNum > 0, btcNum > 0, priceNum > 0].filter(Boolean).length;

        if (filledValues === 2) {
            const newInputs = { ...calculatorInputs };

            if (eurosNum === 0 && btcNum > 0 && priceNum > 0) {
                newInputs.euros = (btcNum * priceNum).toFixed(2);
            } else if (btcNum === 0 && eurosNum > 0 && priceNum > 0) {
                newInputs.btcAmount = (eurosNum / priceNum).toFixed(8);
            } else if (priceNum === 0 && eurosNum > 0 && btcNum > 0) {
                newInputs.purchasePrice = (eurosNum / btcNum).toFixed(8);
            }

            setCalculatorInputs(newInputs);
        }
    }, 1000); // Tiempo de debounce de 300ms

    useEffect(() => {
        // Ejecutar la función debounced cuando cambien las dependencias
        handleCalculation();

        // Limpiar el timeout del debounce al desmontar o cambiar las dependencias
        return () => {
            handleCalculation.cancel();
        };
    }, [calculatorInputs.euros, calculatorInputs.btcAmount, calculatorInputs.purchasePrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        const { error } = await supabase.from('transactions').insert({
            euros: parseFloat(calculatorInputs.euros),
            btc_amount: parseFloat(calculatorInputs.btcAmount),
            purchase_price: parseFloat(calculatorInputs.purchasePrice),
            wallet,
            date,
            crypto_id: cryptoId,
            user_id: user.id,
        });

        if (error) console.error('Error inserting transaction:', error);
        else {
            onTransactionAdded();
            setCalculatorInputs({ euros: '', btcAmount: '', purchasePrice: '' });
            setCryptoId(null);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InputField
                label="Cantidad en Euros"
                type="number"
                value={calculatorInputs.euros}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, euros: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                icon={<EuroIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            />
            <InputField
                label="Cantidad de BTC"
                type="number"
                value={calculatorInputs.btcAmount}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, btcAmount: e.target.value })}
                placeholder="0.00000000"
                step="0.00000001"
                min="0"
                icon={<Bitcoin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            />
            <InputField
                label="Precio de Compra (€)"
                type="number"
                value={calculatorInputs.purchasePrice}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, purchasePrice: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                icon={<EuroIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            />
            <InputField
                label="Wallet"
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Exchange"
                icon={<Wallet className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            />
            <InputField
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                icon={<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            />
            <SelectField
                label="Tipo de Activo"
                value={cryptoId}
                onChange={(e) => setCryptoId(Number(e.target.value))}
                options={cryptos}
            />
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