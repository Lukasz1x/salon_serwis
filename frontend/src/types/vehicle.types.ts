export interface Vehicle {
    id: number;
    model: string;
    productionYear: number;
    vin: string;
    cataloguePrice: number;
    marginPrice: number;
    status: string;
    isActive: boolean;
}

export interface VehicleRequest {
    model: string;
    productionYear: number;
    vin: string;
    cataloguePrice: number;
    marginPrice: number;
    locationId: number;
    status: string;
}