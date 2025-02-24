import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import axios from 'axios';
import { Carousel } from 'antd';

interface Crypto {
    id: number;
    name: string;
    symbol: string;
    api_url: string;
}

const CryptoCarousel: React.FC = () => {
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [prices, setPrices] = useState<{ [key: string]: number | null }>({});

    // Función para obtener las criptomonedas desde Supabase
    useEffect(() => {
        const fetchCryptos = async () => {
            const { data, error } = await supabase.from('cryptos').select('*');
            if (error) {
                console.error('Error fetching cryptos:', error);
            } else {
                setCryptos(data || []);
            }
        };
        fetchCryptos();
    }, []);

    // Función para obtener los precios de las criptomonedas con retraso entre peticiones
    useEffect(() => {
        const fetchPricesWithDelay = async (cryptoList: Crypto[], index = 0) => {
            if (index >= cryptoList.length) return;

            const crypto = cryptoList[index];
            try {
                const response = await axios.get(crypto.api_url);

                // Obtener el valor de "eur" de manera genérica
                const priceData = Object.values(response.data)[0]; // Acceso genérico
                let newPrice: number | null = null;

                if (priceData && typeof priceData.eur === 'number') {
                    newPrice = priceData.eur; // Extraer el precio
                } else {
                    console.error(`Invalid price data for ${crypto.symbol}:`, priceData);
                    newPrice = null; // Marcar como no disponible
                }

                // Actualizar el estado de los precios
                setPrices((prevPrices) => ({
                    ...prevPrices,
                    [crypto.symbol]: newPrice,
                }));
            } catch (error) {
                console.error(`Error fetching price for ${crypto.name}:`, error);
                // Mantener el valor anterior en caso de error
                setPrices((prevPrices) => ({
                    ...prevPrices,
                    [crypto.symbol]: prevPrices[crypto.symbol] ?? null,
                }));
            } finally {
                // Esperar 30 segundos antes de la siguiente petición
                setTimeout(() => {
                    fetchPricesWithDelay(cryptoList, index + 1);
                }, 30000); // 30 segundos
            }
        };

        const fetchPrices = async () => {
            if (cryptos.length > 0) {
                await fetchPricesWithDelay(cryptos);
            }
        };

        if (cryptos.length > 0) {
            fetchPrices();
            const interval = setInterval(fetchPrices, 1800000); // Actualizar cada 30 minutos
            return () => clearInterval(interval);
        }
    }, [cryptos]);

    return (
        <Carousel autoplay>
            {cryptos.map((crypto) => (
                <div key={crypto.id} className="p-4 text-center">
                    <h3 className="text-lg font-medium">{crypto.name} ({crypto.symbol})</h3>
                    <p className="text-2xl">
                        {typeof prices[crypto.symbol] === 'number' ? (
                            `${prices[crypto.symbol]?.toFixed(2)} €`
                        ) : (
                            <span>Cargando...</span>
                        )}
                    </p>
                </div>
            ))}
        </Carousel>
    );
};

export default CryptoCarousel;