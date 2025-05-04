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



 