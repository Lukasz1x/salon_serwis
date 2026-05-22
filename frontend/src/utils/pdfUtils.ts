export const openPdfInNewTab = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const newTab = window.open(url, '_blank')

    if (newTab) {
        newTab.addEventListener('load', () => {URL.revokeObjectURL(url)})
    } else {
        const a = document.createElement('a')
        a.href = url
        a.download = 'invoice.pdf'
        a.click()
        URL.revokeObjectURL(url)
    }
}