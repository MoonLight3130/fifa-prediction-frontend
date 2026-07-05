export function exportToCsv(filename: string, headers: string[], rows: string[][]): void {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const content = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join(
    '\n',
  )

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPdf(title: string, htmlContent: string): void {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 20px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${htmlContent}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

export function tableHtml(headers: string[], rows: string[][]): string {
  const head = headers.map((header) => `<th>${header}</th>`).join('')
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('')
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}
