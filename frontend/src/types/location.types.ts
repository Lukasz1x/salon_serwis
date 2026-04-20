export type LocationType = 'SALON' | 'SERVICE' | 'HYBRID'

export interface Location{
    id: number;
    name: string;
    phone: string;
    street:string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    locationType: LocationType;
    active: boolean;
}