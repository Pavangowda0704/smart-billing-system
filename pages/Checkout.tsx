import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../services/api';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const Checkout: React.FC = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const { items, totalAmount } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleVerifyAndPay = async () => {
        setIsVerifying(true);
        try {
            const result = await api.verifyCheckout(items);
            if (result.status === 'OK') {
                showToast('Cart verified successfully!', 'success');
                navigate('/payment');
            } else {
                showToast('Cart verification failed. Please check your items.', 'error');
            }
        } catch (error) {
            showToast('An error occurred during verification.', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md text-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Final Bill</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Please confirm your items before payment.</p>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 text-left max-h-60 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between py-1">
                            <span className="text-gray-700 dark:text-gray-300">{item.name} x{item.quantity}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="text-2xl font-extrabold text-gray-900 dark:text-white flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-4 mb-8">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>

                {isVerifying ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Spinner />
                        <p className="text-gray-600 dark:text-gray-400">Verifying with weight sensors & computer vision...</p>
                    </div>
                ) : (
                    <Button onClick={handleVerifyAndPay} isLoading={isVerifying}>
                        Verify & Proceed to Payment
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Checkout;