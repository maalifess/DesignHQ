import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// ── Export element as PNG ──────────────────────────────────────────────────────
export async function exportAsPNG(element: HTMLElement, filename: string = 'export') {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ── Export element as PDF ──────────────────────────────────────────────────────
export async function exportAsPDF(element: HTMLElement, filename: string = 'export', title?: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FDF6F6',
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  })

  if (title) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(24)
    pdf.setTextColor(128, 0, 32)
    pdf.text(title, 20, 30)
  }

  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2)
  pdf.save(`${filename}.pdf`)
}

// ── Export portfolio as multi-page PDF ────────────────────────────────────────
export async function exportPortfolioPDF(sections: HTMLElement[], filename: string = 'portfolio') {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let isFirst = true

  for (const section of sections) {
    const canvas = await html2canvas(section, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FDF6F6',
    })

    if (!isFirst) pdf.addPage()
    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = (canvas.height / canvas.width) * pageWidth

    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, Math.min(pageHeight, pdf.internal.pageSize.getHeight()))
    isFirst = false
  }

  pdf.save(`${filename}.pdf`)
}

// ── Export Fabric Library as PDF Lookbook ─────────────────────────────────────
export async function exportFabricLookbook(container: HTMLElement) {
  await exportAsPDF(container, 'fabric-library-lookbook', 'Fabric & Material Library')
}

// ── Convert dataURL to base64 ─────────────────────────────────────────────────
export function dataURLToBase64(dataURL: string): string {
  return dataURL.split(',')[1] || ''
}

// ── Convert file to base64 ────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(dataURLToBase64(result))
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Upload file to Supabase Storage ──────────────────────────────────────────
export async function uploadToSupabase(
  supabase: any,
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) {
    console.error('Upload error:', error)
    return null
  }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

// ── Format date PKR style ─────────────────────────────────────────────────────
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ── Days until deadline ───────────────────────────────────────────────────────
export function daysUntil(deadline: string | Date): number {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ── Deadline urgency color ────────────────────────────────────────────────────
export function deadlineColor(days: number): string {
  if (days <= 1) return 'var(--status-danger)'
  if (days <= 7) return 'var(--status-warning)'
  if (days <= 14) return '#B86A00'
  return 'var(--status-success)'
}

export function deadlineBadgeClass(days: number): string {
  if (days <= 1) return 'badge-danger'
  if (days <= 7) return 'badge-warning'
  return 'badge-success'
}
