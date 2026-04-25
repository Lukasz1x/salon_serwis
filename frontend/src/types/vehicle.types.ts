export interface Vehicle {
    id: number;
    model: string;
    productionYear: number;
    vin: string;
    cataloguePrice: number;
    marginPrice: number;
    status: string;
    active: boolean;
    engineSpec?: string;
    equipment?: Record<string, string>
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