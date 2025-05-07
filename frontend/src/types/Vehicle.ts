export interface Vehicle {
    id?: number;
    vehicleId: number;
    vehicleRegistrationNo: string;
    vehicleType: string;
    ownerName: string;
    contactNo: string;
    mileage: number;
    lastUpdate: string;
    contactNumber: string;
}

export interface OwnershipHistory {
    id?: number;
    vehicleId: number;
    previousOwnerName: string;
    previousOwnerContact: string;
    newOwnerName: string;
    newOwnerContact: string;
    transferDate: string;
}