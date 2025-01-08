import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-08'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false
})



const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
    return builder.image(source)
}

export interface Post {
    _id: string
    title: string
    slug: {
        current: string
    }
    publishedAt: string
    category: string
    excerpt?: string
    mainImage?: {
        asset: {
            _ref: string
        }
    }
    topPost?: boolean
    content: any[]
}
