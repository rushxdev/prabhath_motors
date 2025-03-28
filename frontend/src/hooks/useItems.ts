import { useState, useCallback } from 'react';
import { StockItem, ItemCategory } from '../types/Stock';
import { itemService } from '../services/stockItemService';
import { toast } from 'react-toastify';

export const useItems = () => {
    const [items, setItems] = useState<StockItem[]>([]);
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await itemService.getAllItems();
            setItems(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch items');
            toast.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await itemService.getAllCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    }, []);

    return {
        items,
        categories,
        loading,
        error,
        fetchItems,
        fetchCategories
    };
};