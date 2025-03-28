import { apiClient } from '../axios.config';
import { Supplier } from '../types/Stock';

class SupplierService {
    private readonly baseUrl = '/supplier';

    async getAllSuppliers(): Promise<Supplier[]> {
        const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/get`);
        return response.data;
    }

    async getSupplierByName(name: string): Promise<Supplier[]> {
        const response = await apiClient.get<Supplier[]>(`/supplier/search?name=${name}`);
        return response.data;
    }
}

export const supplierService = new SupplierService();