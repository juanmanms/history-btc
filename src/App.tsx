import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { supabase } from './supabase';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import TransactionModal from './components/TransactionModal';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import ProfitDisplay from './components/ProfitDisplay';
import CryptoCarousel from './components/CryptoCarousel';
import { Transaction } from './interfaces/types';
import { message } from 'antd';

const App: React.FC = () => {
  const [currentBTCPrice, setCurrentBTCPrice] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTransactions();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTransactions();
      else setTransactions([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) console.error('Error fetching transactions:', error);
    else setTransactions(data);
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

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting transaction:', error);
    else {
      message.success('Transacción eliminada correctamente');
      fetchTransactions();
    }
  };

  if (!session) {
    return <AuthForm onAuthSuccess={fetchTransactions} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header onLogout={() => supabase.auth.signOut()} />
        <TransactionModal onTransactionAdded={fetchTransactions} />
        <ProfitDisplay transactions={transactions} currentBTCPrice={currentBTCPrice} />
        <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        <Summary transactions={transactions} />
        <CryptoCarousel />
      </div>
    </div>
  );
};

export default App;