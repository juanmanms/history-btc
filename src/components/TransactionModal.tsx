import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import TransactionForm from './TransactionForm';

interface TransactionModalProps {
    onTransactionAdded: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ onTransactionAdded }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleTransactionAdded = () => {
        onTransactionAdded();
        setIsModalVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal} className="w-full">
                Añadir Transacción
            </Button>
            <Modal
                title="Añadir Transacción"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </Modal>
        </>
    );
};

export default TransactionModal;