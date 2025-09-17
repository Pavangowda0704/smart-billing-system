import { Product, User } from '../types';

// Mock database of products
// Changed to let to allow mutation for admin actions
let MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Apples', price: 180, weight: 500, barcode: '123456789012', imageUrl: 'https://picsum.photos/id/102/200/200' },
  { id: '2', name: 'Whole Wheat Bread', price: 120, weight: 750, barcode: '234567890123', imageUrl: 'https://picsum.photos/id/203/200/200' },
  { id: '3', name: 'Almond Milk', price: 250, weight: 1000, barcode: '345678901234', imageUrl: 'https://picsum.photos/id/304/200/200' },
  { id: '4', name: 'Free-Range Eggs', price: 90, weight: 600, barcode: '456789012345', imageUrl: 'https://picsum.photos/id/405/200/200' },
  { id: '5', name: 'Avocado', price: 150, weight: 150, barcode: '567890123456', imageUrl: 'https://picsum.photos/id/506/200/200' },
];

const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// Mock API functions
export const login = async (username: string, password_unused: string): Promise<{ token: string; user: User }> => {
    console.log(`Logging in with username: ${username}`);
    const isAdmin = username.toLowerCase() === 'admin';
    const user: User = { id: 'user-123', username, role: isAdmin ? 'admin' : 'user' };
    return simulateDelay({ token: 'fake-jwt-token', user });
};

export const registerCart = async (cartId: string, userId: string): Promise<{ success: boolean }> => {
    console.log(`Registering cart ${cartId} for user ${userId}`);
    return simulateDelay({ success: true }, 800);
};

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    console.log(`Scanning for barcode: ${barcode}`);
    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    return simulateDelay(product);
};

export const getProducts = async (): Promise<Product[]> => {
    console.log('Fetching all products for admin');
    return simulateDelay(MOCK_PRODUCTS, 300);
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    console.log('Adding new product:', productData);
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productData,
        imageUrl: productData.imageUrl || `https://picsum.photos/seed/${Date.now()}/200/200`,
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return simulateDelay(newProduct, 600);
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    console.log('Updating product:', updatedProduct);
    MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    return simulateDelay(updatedProduct, 600);
};

export const deleteProduct = async (productId: string): Promise<{ success: boolean }> => {
    console.log('Deleting product:', productId);
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== productId);
    return simulateDelay({ success: true }, 600);
};


export const verifyCheckout = async (cartItems: any[]): Promise<{ status: 'OK' | 'MISMATCH' }> => {
    console.log('Verifying cart contents:', cartItems);
    return simulateDelay({ status: 'OK' }, 1500);
};

export const processPayment = async (amount: number): Promise<{ success: boolean; transactionId: string }> => {
    console.log(`Processing payment of ₹${amount.toFixed(2)}`);
    return simulateDelay({ success: true, transactionId: `txn_${Date.now()}` }, 2000);
};

export const confirmExit = async (): Promise<{ success: boolean }> => {
    console.log('Confirming exit');
    return simulateDelay({ success: true });
};