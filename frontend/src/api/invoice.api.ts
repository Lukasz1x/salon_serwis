import {apiClient} from './AxiosClient.ts';
import {InvoiceSaleRequest, InvoiceRepairRequest} from "@/types/invoice.type.ts";
import {blob} from "node:stream/consumers";

export const createSaleInvoice = async (saleInvoice: InvoiceSaleRequest) => {
    const { data } = await apiClient.post('/invoice/generateSale', saleInvoice)
    return data
}

export const createRepairInvoice = async (repairInvoice: InvoiceRepairRequest) => {
    const { data } = await apiClient.post('/invoice/generateRepair', repairInvoice)
    return data
}

export const getSalesOrderInvoiceBytes = async (invoiceId: String): Promise<{ blob: Blob, filename?: string }> =>{
    const response = await apiClient.get(`/invoice/getSaleInvoice?invoiceId=${invoiceId}`,{
        responseType: "blob"
    })
    const disposition = response.headers['content-disposition']
    const match = disposition?.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/)
    const filename = match?.[1]?.trim()

    return {blob: response.data, filename}
}

export const getServiceOrderInvoiceBytes = async (invoiceId: String): Promise<{ blob: Blob, filename?: string }> => {
    const response = await apiClient.get(`/invoice/getRepairInvoice?invoiceId=${invoiceId}`,{
        responseType: "blob"
    })
    const disposition = response.headers['content-disposition']
    const match = disposition?.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/)
    const filename = match?.[1]?.trim()

    return {blob: response.data, filename}
}