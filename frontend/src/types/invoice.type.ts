export interface InvoiceRepairRequest {
    id: string;
    appointmentId: number;
    dueDate: string;
}

export interface InvoiceSaleRequest {
    id: string;
    clientId: number;
    saleOrderId: number;
    dueDate: string;
}
