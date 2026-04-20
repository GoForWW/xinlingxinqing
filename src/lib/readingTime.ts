import readingTime from 'reading-time'

export function getReadingTime(text: string): string {
  const result = readingTime(text)
  // Convert to Chinese-friendly format: "X 分鐘"
  const minutes = Math.ceil(result.minutes)
  return `${minutes} 分鐘`
}

export function getReadingTimeObject(text: string) {
  const result = readingTime(text)
  return {
    minutes: Math.ceil(result.minutes),
    text: `${Math.ceil(result.minutes)} 分鐘`,
    words: result.words,
  }
}
