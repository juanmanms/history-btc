import React from 'react';
import { Table, Button } from 'antd';
import { Transaction } from '../interfaces/types';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';

interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
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
            title: 'BTC',
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

    return (
        <Table
            dataSource={transactions}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
        />
    );
};

export default TransactionList;