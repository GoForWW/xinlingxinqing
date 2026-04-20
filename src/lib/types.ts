export interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body?: any[]
  categories?: Category[]
  tags?: string[]
  author?: Author
  audio?: SanityFile
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

export interface Author {
  name: string
  image?: SanityImage
  bio?: any[]
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SanityFile {
  _type: 'file'
  asset: {
    _ref: string
    _type: 'reference'
  }
}
