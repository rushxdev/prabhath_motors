export interface Job {
    id?: number;
    jobId: string;
    vehicleRegistrationNumber: string;
    serviceSection: ServiceSection;
    assignedEmployee: string;
    tasks: string[];
    spareParts: string[];
    status: string;
}

export enum ServiceSection {
    GARAGE = "GARAGE",
    BODY_SHOP = "BODY_SHOP",
    PAINT_SHOP = "PAINT_SHOP",
    WASH_BAY = "WASH_BAY"
}

export enum JobStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export interface Task {
    id: number;
    description: string;
    cost: number;
}

export interface SparePart {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface Employee {
    empId: number;
    firstname: string;
    lastname: string;
    role: string;
    contact: string;
    nic: string;
    dob: string;
    gender: string;
    salary: number;
} 