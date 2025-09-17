import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';
import * as api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { ICONS } from '../constants';

const RegisterCart: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 for scan, 2 for budget
    const [budgetInput, setBudgetInput] = useState('');
    const { user } = useAuth();
    const { setBudget } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleScanCart = async () => {
        setIsLoading(true);
        try {
            const cartId = `cart-${Date.now()}`;
            if (user) {
                await api.registerCart(cartId, user.id);
                showToast('Cart linked successfully!', 'success');
                setStep(2);
            } else {
                 showToast('User not found. Please log in again.', 'error');
            }
        } catch (error) {
            showToast('Failed to link cart. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const budgetAmount = parseFloat(budgetInput);
        if (isNaN(budgetAmount) || budgetAmount <= 0) {
            showToast('Please enter a valid budget amount.', 'error');
            return;
        }
        setBudget(budgetAmount);
        showToast(`Budget of ₹${budgetAmount} set. Happy shopping!`, 'success');
        navigate('/scan');
    };

    return (
        <div className="container mx-auto max-w-lg text-center flex flex-col items-center justify-center h-full">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full">
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link Your Shopping Cart</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Scan the QR code on your physical shopping cart to begin.
                        </p>
                        <div className="text-primary-500 dark:text-primary-400 w-32 h-32 mx-auto mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5-.5H11v-1h.5v1zm-2 0h-1v-1H9v1zm8-1.5V12h-1v.5h1zm-5.5 0v-1h-1v1h1zm-2 0v-1h-1v1h1zM8 4H6a2 2 0 00-2 2v2M8 12H6M8 20H6a2 2 0 01-2-2v-2m12 4h2a2 2 0 002-2v-2m-4-8h2a2 2 0 002-2V6" />
                            </svg>
                        </div>
                        <Button onClick={handleScanCart} isLoading={isLoading} icon={ICONS.qr}>
                            Scan Cart QR Code
                        </Button>
                    </>
                )}
                {step === 2 && (
                    <form onSubmit={handleSetBudget}>
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Set Your Shopping Budget</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Enter your budget to get alerts as you shop.
                        </p>
                        <Input 
                            id="budget"
                            label="Budget Amount (₹)"
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="e.g., 2000"
                            required
                            min="1"
                        />
                        <Button type="submit" className="mt-6">
                            Start Shopping
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterCart;