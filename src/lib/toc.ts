export interface TocHeading {
  id: string
  text: string
  level: number // 2 for h2, 3 for h3
}

/**
 * Extract headings from Sanity Portable Text blocks for Table of Contents.
 * Generates anchor-friendly IDs from heading text.
 */
export function extractHeadings(body: any[]): TocHeading[] {
  if (!body || !Array.isArray(body)) return []

  const headings: TocHeading[] = []

  for (const block of body) {
    if (block._type !== 'block') continue
    if (block.style !== 'h2' && block.style !== 'h3') continue

    const text = block.children?.map((child: any) => child.text).join('') || ''
    if (!text.trim()) continue

    const level = block.style === 'h3' ? 3 : 2
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u4e00-\u9fff\-]/g, '') // keep Chinese chars
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    headings.push({ id, text, level })
  }

  return headings
}
