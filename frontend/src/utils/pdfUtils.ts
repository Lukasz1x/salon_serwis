export const downloadPdf = (blob: Blob, filename?: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ?? 'invoice.pdf'
    a.click()
    URL.revokeObjectURL(url)
}