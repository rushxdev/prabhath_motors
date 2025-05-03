import { apiClient } from '../axios.config';
import { StockItem, ItemCategory, Stock_In } from '../types/Stock';
import { AxiosError } from 'axios';

class ItemService {
    private readonly baseUrl = '/item';
    private readonly categoryUrl = '/itemCtgry';

    async getAllItems(): Promise<StockItem[]> {
        const response = await apiClient.get<StockItem[]>(`${this.baseUrl}/get`);
        return response.data;
    }

    async createCategory(categoryName: string): Promise<ItemCategory> {
        const response = await apiClient.post<ItemCategory>(`${this.categoryUrl}/save`, {
            itemCtgryName: categoryName
        });
        return response.data;
    }

    async createItem(item: Partial<StockItem>): Promise<StockItem> {
        const response = await apiClient.post<StockItem>(`${this.baseUrl}/save`, item);
        return response.data;
    }

    async updateItem(id: number, item: Partial<StockItem>): Promise<StockItem> {
        const response = await apiClient.put<StockItem>(`${this.baseUrl}/update/${id}`, item);
        return response.data;
    }

    async deleteItem(id: number): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/delete/${id}`);
    }

    async createStockIn(stockInData: Partial<Stock_In>): Promise<Stock_In> {
        const response = await apiClient.post<Stock_In>('/stock_in/save', stockInData);
        return response.data;
    }

    async getAllCategories(): Promise<ItemCategory[]> {
        try {
            console.log('Fetching categories from:', `${this.categoryUrl}/get`);
            const response = await apiClient.get<ItemCategory[]>(`${this.categoryUrl}/get`);
            console.log('Categories response:', response);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in getAllCategories:', axiosError);
            console.error('Error details:', {
                message: axiosError.message,
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config
            });
            throw error;
        }
    }
}

export const itemService = new ItemService();