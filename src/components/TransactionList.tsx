import React, { useEffect, useState } from 'react';
import { Table, Button, List, Card } from 'antd';
import { Transaction } from '../interfaces/types';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../supabase';
import { Crypto } from '../interfaces/types';

interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const isDesktop = useMediaQuery({ minWidth: 768 });

    useEffect(() => {
        const fetchCryptos = async () => {
            const { data, error } = await supabase.from('cryptos').select('*');
            if (error) console.error('Error fetching cryptos:', error);
            else setCryptos(data);
        };

        fetchCryptos();
    }, []);

    const getCryptoName = (cryptoId: number) => {
        const crypto = cryptos.find((c) => c.id === cryptoId);
        return crypto ? `${crypto.name} (${crypto.symbol})` : 'Desconocido';
    };

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (text: string) => new Date(text).toLocaleDateString('es-ES'),
        },
        {
            title: 'Euros',
            dataIndex: 'euros',
            key: 'euros',
            align: 'right',
            render: (value: number) => `${value.toLocaleString('es-ES')} €`,
        },
        {
            title: 'Cantidad de activo',
            dataIndex: 'btc_amount',
            key: 'btc_amount',
            align: 'right',
            render: (value: number) => value.toFixed(8),
        },
        {
            title: 'Precio Compra',
            dataIndex: 'purchase_price',
            key: 'purchase_price',
            align: 'right',
            render: (value: number) => `${value.toLocaleString('es-ES')} €`,
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
        },
        {
            title: 'Tipo de Activo',
            dataIndex: 'crypto_id',
            key: 'crypto_id',
            render: (cryptoId: number) => getCryptoName(cryptoId),
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => onDeleteTransaction(record.id)}
                    danger
                />
            ),
        },
    ];

    return isDesktop ? (
        <Table
            dataSource={transactions}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
        />
    ) : (
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
            }}
            dataSource={transactions}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        title={`Transacción del ${new Date(item.date).toLocaleDateString("es-ES")}`}
                        extra={<Button type="text" icon={<DeleteOutlined />} onClick={() => onDeleteTransaction(item.id)} danger />}
                    >
                        <div className="space-y-2">
                            <div>
                                <strong>Euros:</strong>
                                <span style={{ float: 'right' }}>{item.euros.toLocaleString("es-ES")} €</span>
                            </div>
                            <div>
                                <strong>Activo</strong>
                                <span style={{ float: 'right' }}>{item.btc_amount.toFixed(8)}</span>
                            </div>
                            <div>
                                <strong>Precio Compra:</strong>
                                <span style={{ float: 'right' }}>{item.purchase_price.toLocaleString("es-ES")} €</span>
                            </div>
                            <div>
                                <strong>Wallet:</strong>
                                <span style={{ float: 'right' }}>{item.wallet}</span>
                            </div>
                        </div>
                    </Card>
                </List.Item>
            )}
            pagination={{
                pageSize: 5,
                showSizeChanger: false,
            }}
        />
    );
};

export default TransactionList;