import React, { useState } from 'react';
// Fix: Replaced useHistory with useNavigate for v6/v7 compatibility.
import { useNavigate } from 'react-router-dom';
import CameraScanner from '../components/CameraScanner';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../services/api';
import { ICONS } from '../constants';

const ScanProduct: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const { addItem, items } = useCart();
    const { showToast } = useToast();
    // Fix: Replaced useHistory with useNavigate for v6/v7 compatibility.
    const navigate = useNavigate();

    const handleScan = async () => {
        setIsScanning(true);
        try {
            // Simulate scanning a random barcode
            const randomBarcode = `barcode-${Math.floor(Math.random() * 1000)}`;
            const product = await api.getProductByBarcode(randomBarcode);
            if (product) {
                addItem(product);
                showToast(`${product.name} added to cart`, 'success');
            } else {
                showToast('Product not found', 'error');
            }
        } catch (error) {
            showToast('An error occurred while scanning', 'error');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="container mx-auto max-w-lg text-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scan Product Barcode</h2>
                <CameraScanner />
                <div className="mt-6 space-y-4">
                    <Button onClick={handleScan} isLoading={isScanning} icon={ICONS.scan}>
                        Simulate Scan
                    </Button>
                    {items.length > 0 && (
                        <Button onClick={() => navigate('/cart')} variant="secondary" icon={ICONS.cart}>
                            View Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanProduct;