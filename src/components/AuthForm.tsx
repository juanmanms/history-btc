import React, { useState } from 'react';
import { supabase } from '../supabase';
import { LogIn, UserPlus, Bitcoin } from 'lucide-react';

interface AuthFormProps {
    onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [authForm, setAuthForm] = useState({ email: '', password: '' });
    const [authError, setAuthError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        try {
            if (authMode === 'register') {
                const { error } = await supabase.auth.signUp(authForm);
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword(authForm);
                if (error) throw error;
            }
            onAuthSuccess();
        } catch (error: any) {
            setAuthError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Bitcoin className="text-yellow-500" />
                            Historico BTC
                        </h1>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setAuthMode('login')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${authMode === 'login'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <LogIn className="w-4 h-4" />
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setAuthMode('register')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${authMode === 'register'
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

                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Datos de acceso de demostración</h2>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> demo@demo.es</p>
                        <p className="text-sm text-gray-600"><strong>Contraseña:</strong> demo1234</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;