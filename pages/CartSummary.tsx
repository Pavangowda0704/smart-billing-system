import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import { ICONS } from '../constants';
import { CartItem } from '../types';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();
    const { showToast } = useToast();

    const handleRemove = () => {
        removeItem(item.id);
        showToast(`${item.name} removed from cart.`, 'info');
    };

    return (
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">{ICONS.minus}</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">{ICONS.plus}</button>
            </div>
            <button onClick={handleRemove} className="ml-4 p-2 text-red-500 hover:text-red-700">{ICONS.trash}</button>
        </div>
    );
}

const BudgetTracker: React.FC = () => {
    const { totalAmount, budget } = useCart();
    if (!budget) return null;

    const percentage = Math.min((totalAmount / budget) * 100, 100);
    const isOverBudget = totalAmount > budget;
    const progressBarColor = isOverBudget ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-xl border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-2 text-sm font-medium">
                <span className="text-gray-600 dark:text-gray-300">Spent: ₹{totalAmount.toFixed(2)}</span>
                <span className="text-gray-600 dark:text-gray-300">Budget: ₹{budget.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            {isOverBudget && (
                 <p className="text-red-500 text-xs text-center mt-1">You are ₹{(totalAmount - budget).toFixed(2)} over budget!</p>
            )}
        </div>
    );
};

const CartSummary: React.FC = () => {
    const { items, totalAmount } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <BudgetTracker />
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart Summary</h2>
                </div>
                
                {items.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>Your cart is empty.</p>
                        <Button onClick={() => navigate('/scan')} className="mt-4 max-w-xs mx-auto">Start Scanning</Button>
                    </div>
                ) : (
                    <div>
                        <div className="max-h-80 overflow-y-auto">
                            {items.map(item => <CartItemRow key={item.id} item={item} />)}
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center text-lg font-bold mb-6">
                                <span className="text-gray-800 dark:text-gray-200">Total Amount:</span>
                                <span className="text-primary-600 dark:text-primary-400">₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <Button onClick={() => navigate('/checkout')} icon={ICONS.checkout}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSummary;