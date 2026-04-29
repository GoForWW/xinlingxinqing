import readingTime from 'reading-time'

/** Extract plain text from Sanity Portable Text blocks */
function extractBodyText(body: any[] | undefined | null): string {
  if (!Array.isArray(body)) return ''
  return body
    .filter((block: any) => block._type === 'block')
    .flatMap((block: any) => block.children || [])
    .filter((child: any) => child._type === 'span' || !child._type)
    .map((child: any) => child.text || '')
    .join('')
}

/**
 * Get reading time string. Accepts either a plain text string or a Sanity Portable Text body array.
 * Falls back to excerpt-based estimate if no body is provided.
 */
export function getReadingTime(text: string, body?: any[]): string {
  const content = extractBodyText(body) || text || ''
  const result = readingTime(content)
  const minutes = Math.max(1, Math.ceil(result.minutes))
  return `${minutes} 分鐘`
}

export function getReadingTimeObject(text: string) {
  const result = readingTime(text)
  return {
    minutes: Math.max(1, Math.ceil(result.minutes)),
    text: `${Math.max(1, Math.ceil(result.minutes))} 分鐘`,
    words: result.words,
  }
}
