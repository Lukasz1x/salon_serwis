import {apiClient} from './AxiosClient.ts';
import {InvoiceSaleRequest, InvoiceRepairRequest} from "@/types/invoice.type.ts";

export const createSaleInvoice = async (saleInvoice: InvoiceSaleRequest) => {
    const { data } = await apiClient.post('/invoice/generateSale', saleInvoice)
    return data
}

export const createRepairInvoice = async (repairInvoice: InvoiceRepairRequest) => {
    const { data } = await apiClient.post('/invoice/generateRepair', repairInvoice)
    return data
}

export const getSalesOrderInvoiceBytes = async (invoiceId: String): Promise<Blob> =>{
    const { data } = await apiClient.get(`/invoice/getSaleInvoice?invoiceId=${invoiceId}`,{
        responseType: "blob"
    })
    return data
}

export const getServiceOrderInvoiceBytes = async (invoiceId: String): Promise<Blob> => {
    const { data } = await apiClient.get(`/invoice/getRepairInvoice?invoiceId=${invoiceId}`,{
        responseType: "blob"
    })
    return data
}