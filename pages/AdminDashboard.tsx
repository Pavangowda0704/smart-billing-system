
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Input from '../components/Input';
import ConfirmationModal from '../components/ConfirmationModal';
import { ICONS } from '../constants';
import { useToast } from '../contexts/ToastContext';

// Define a type for the product form state
type EditableProduct = Omit<Product, 'id'> & { id?: string };

// Modal component for adding/editing products
const ProductFormModal: React.FC<{
    product: EditableProduct | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: EditableProduct) => Promise<void>;
}> = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<EditableProduct>({ name: '', price: 0, weight: 0, barcode: '', imageUrl: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            // Reset form for new product
            setFormData({ name: '', price: 0, weight: 0, barcode: '', imageUrl: '' });
        }
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'weight' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {product && product.id ? 'Edit Product' : 'Add New Product'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <Input label="Product Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                        <Input label="Price (₹)" id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
                        <Input label="Weight (g)" id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} required min="0" />
                        <Input label="Barcode" id="barcode" name="barcode" type="text" value={formData.barcode} onChange={handleChange} required />
                        <Input label="Image URL" id="imageUrl" name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} placeholder="Optional, auto-generated if blank" />
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-4 rounded-b-xl">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" isLoading={isSaving}>Save Product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<EditableProduct | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await api.getProducts();
                setProducts(productList);
            } catch (error) {
                console.error("Failed to fetch products", error);
                showToast("Failed to load products.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [showToast]);

    const handleAddNew = () => {
        setCurrentProduct({ name: '', price: 0, weight: 0, barcode: '', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsConfirmModalOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await api.deleteProduct(productToDelete.id);
            setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
            showToast(`"${productToDelete.name}" deleted successfully.`, 'success');
        } catch (error) {
            console.error("Failed to delete product", error);
            showToast('Failed to delete product. Please try again.', 'error');
        } finally {
            setIsConfirmModalOpen(false);
            setProductToDelete(null);
            setIsDeleting(false);
        }
    };


    const handleSave = async (productData: EditableProduct) => {
        try {
            if (productData.id) { // Editing existing product
                const updatedProduct = await api.updateProduct(productData as Product);
                setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                showToast(`"${updatedProduct.name}" updated successfully.`, 'success');
            } else { // Adding new product
                const newProduct = await api.addProduct(productData);
                setProducts(prev => [newProduct, ...prev]);
                showToast(`"${newProduct.name}" added successfully.`, 'success');
            }
            setIsModalOpen(false);
            setCurrentProduct(null);
        } catch (error) {
             console.error("Failed to save product", error);
             showToast('Failed to save product. Please try again.', 'error');
        }
    };
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
                    <Button onClick={handleAddNew} icon={ICONS.plus}>Add Product</Button>
                </div>

                <div className="mb-6">
                    <Input 
                        id="search"
                        label="Search Products"
                        icon={ICONS.search}
                        type="text"
                        placeholder="Search by name or barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Barcode</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.barcode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.weight}g</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors" title="Edit Product">
                                                {ICONS.edit}
                                            </button>
                                            <button onClick={() => handleDeleteClick(product)} className="p-2 rounded-lg text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors" title="Delete Product">
                                                {ICONS.trash}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                product={currentProduct}
            />
            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />
        </>
    );
};

export default AdminDashboard;
