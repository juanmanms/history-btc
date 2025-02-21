import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bitcoin, EuroIcon, TrendingUp, Calculator, Wallet, Calendar, Trash2, LogIn, UserPlus, LogOut } from 'lucide-react';
import { supabase } from './supabase';

interface Transaction {
  id: string;
  euros: number;
  btcAmount: number;
  purchasePrice: number;
  wallet: string;
  date: string;
}

interface AuthForm {
  email: string;
  password: string;
}

function App() {
  const [currentBTCPrice, setCurrentBTCPrice] = useState<number>(0);
  const [euros, setEuros] = useState<string>('');
  const [btcAmount, setBtcAmount] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [wallet, setWallet] = useState<string>('Exchange');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<'euros' | 'btc' | 'price' | null>(null);
  
  // Auth states
  const [session, setSession] = useState(supabase.auth.getSession());
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState<AuthForm>({ email: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchTransactions();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchTransactions();
      } else {
        setTransactions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    setTransactions(data.map(tx => ({
      id: tx.id,
      euros: tx.euros,
      btcAmount: tx.btc_amount,
      purchasePrice: tx.purchase_price,
      wallet: tx.wallet,
      date: tx.date,
    })));
  };

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur');
        setCurrentBTCPrice(response.data.bitcoin.eur);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateTotalProfit();
  }, [transactions, currentBTCPrice]);

  useEffect(() => {
    const eurosNum = parseFloat(euros) || 0;
    const btcNum = parseFloat(btcAmount) || 0;
    const priceNum = parseFloat(purchasePrice) || 0;

    // Solo calculamos si tenemos exactamente dos valores y el tercero es 0
    const filledValues = [eurosNum > 0, btcNum > 0, priceNum > 0].filter(Boolean).length;
    
    if (filledValues === 2) {
      if (eurosNum === 0) {
        setEuros((btcNum * priceNum).toFixed(2));
      } else if (btcNum === 0) {
        setBtcAmount((eurosNum / priceNum).toFixed(8));
      } else if (priceNum === 0) {
        setPurchasePrice((eurosNum / btcNum).toFixed(2));
      }
    }
  }, [euros, btcAmount, purchasePrice]);

  const calculateTotalProfit = () => {
    const profit = transactions.reduce((acc, transaction) => {
      const currentValue = transaction.btcAmount * currentBTCPrice;
      const initialValue = transaction.euros;
      return acc + (currentValue - initialValue);
    }, 0);
    setTotalProfit(profit);
  };

  const getTotals = () => {
    return transactions.reduce((acc, tx) => ({
      euros: acc.euros + tx.euros,
      btc: acc.btc + tx.btcAmount,
      avgPrice: transactions.length > 0 
        ? acc.euros / acc.btc 
        : 0
    }), { euros: 0, btc: 0, avgPrice: 0 });
  };

  const getProfitPercentage = () => {
    const totals = getTotals();
    if (totals.euros === 0) return 0;
    return (totalProfit / totals.euros) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!euros || !btcAmount || !purchasePrice || !session) return;

    const eurosNum = parseFloat(euros);
    const btcNum = parseFloat(btcAmount);
    const priceNum = parseFloat(purchasePrice);

    const { error } = await supabase.from('transactions').insert({
      user_id: session.user.id,
      euros: eurosNum,
      btc_amount: btcNum,
      purchase_price: priceNum,
      wallet,
      date,
    });

    if (error) {
      console.error('Error inserting transaction:', error);
      return;
    }

    fetchTransactions();
    setEuros('');
    setBtcAmount('');
    setPurchasePrice('');
    setWallet('Exchange');
    setDate(new Date().toISOString().split('T')[0]);
    setLastUpdated(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    fetchTransactions();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totals = getTotals();
  const profitPercentage = getProfitPercentage();

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Bitcoin className="text-yellow-500" />
                Historico 
              </h1>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  authMode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  authMode === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Registrarse
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {authError && (
                <div className="text-red-500 text-sm">{authError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bitcoin className="text-yellow-500" />
              Calculadora de Beneficios Bitcoin
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Precio actual:</span>
                <span className="font-bold">{currentBTCPrice.toLocaleString('es-ES')} €</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad en Euros
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={euros}
                  onChange={(e) => {
                    setEuros(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setBtcAmount(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setPurchasePrice(e.target.value);
                  }}
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

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  Beneficio Total
                </h2>
                <span className={`text-sm font-medium ${profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({profitPercentage.toFixed(2)}%)
                </span>
              </div>
              <span className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfit.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            </div>
          </div>

          {transactions.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Euros</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">BTC</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Precio Compra</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Wallet</th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {new Date(tx.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-medium">
                          {tx.euros.toLocaleString('es-ES')} €
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          {tx.btcAmount.toFixed(8)} BTC
                        </td>
                        <td className="px-4 py-2 text-right text-sm">
                          {tx.purchasePrice.toLocaleString('es-ES')} €
                        </td>
                        <td className="px-4 py-2 text-left text-sm">
                          {tx.wallet}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Eliminar transacción"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Resumen Total
                </h3>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;