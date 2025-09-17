import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import { Order } from '../types';

const Payment: React.FC = () => {
    const [status, setStatus] = useState('Processing payment...');
    const { totalAmount, items, clearCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const process = async () => {
            try {
                const result = await api.processPayment(totalAmount);
                if (result.success) {
                    setStatus('Payment Successful!');
                    showToast('Payment successful!', 'success');

                    // Save order to history
                    const newOrder: Order = {
                        id: result.transactionId,
                        date: new Date().toISOString(),
                        items: items,
                        totalAmount: totalAmount,
                    };
                    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
                    history.unshift(newOrder); // Add to the beginning
                    localStorage.setItem('order_history', JSON.stringify(history));
                    
                    setTimeout(() => {
                        clearCart();
                        navigate('/exit');
                    }, 1500);

                } else {
                    setStatus('Payment Failed.');
                    showToast('Payment failed. Please try again.', 'error');
                     setTimeout(() => {
                        navigate('/checkout');
                    }, 1500);
                }
            } catch (error) {
                setStatus('Payment Failed.');
                showToast('An error occurred during payment.', 'error');
                 setTimeout(() => {
                        navigate('/checkout');
                    }, 1500);
            }
        };

        if (totalAmount > 0) {
           process();
        } else {
           navigate('/cart');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container mx-auto max-w-md text-center flex items-center justify-center h-full">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg flex flex-col items-center space-y-6">
                <Spinner size="lg" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{status}</h2>
                <p className="text-gray-600 dark:text-gray-400">Please do not refresh the page.</p>
                <div className="w-full text-lg font-semibold border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                    Amount: <span className="text-primary-600 dark:text-primary-400">₹{totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default Payment;