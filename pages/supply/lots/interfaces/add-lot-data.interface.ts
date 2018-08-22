export interface AddLotData {
    number: string;
    description: string;
    location: string;
    expiration: string;
    kitType: string;
    quantity: number;
    release: boolean;
    country: string;
    container?: string;
}