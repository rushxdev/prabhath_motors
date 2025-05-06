export interface Job {
    id: number;
    jobId: string;
    vehicleRegistrationNumber: string;
    serviceSection: string;
    assignedEmployee: string;
    status: string;
    tasks: NamedCostItem[];
    spareParts: NamedCostItem[];
    totalCost: number;
    ownerName: string;
    contactNo: string;
}

export interface NamedCostItem {
    name: string;
    cost: number;
}

export type JobStatus = 'Ongoing' | 'Done';

export enum ServiceSection {
    GARAGE = "GARAGE",
    BODY_SHOP = "BODY_SHOP",
    PAINT_SHOP = "PAINT_SHOP",
    WASH_BAY = "WASH_BAY"
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}



 