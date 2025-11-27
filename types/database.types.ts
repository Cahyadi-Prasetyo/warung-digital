export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number
                    umkm_id: number
                    name: string
                    description: string
                    history: string
                    philosophy: string
                    video_path: string | null
                    qr_code_path: string | null
                    unique_code: string
                    status: 'active' | 'inactive'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    umkm_id: number
                    name: string
                    description: string
                    history: string
                    philosophy: string
                    video_path?: string | null
                    qr_code_path?: string | null
                    unique_code: string
                    status?: 'active' | 'inactive'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    umkm_id?: number
                    name?: string
                    description?: string
                    history?: string
                    philosophy?: string
                    video_path?: string | null
                    qr_code_path?: string | null
                    unique_code?: string
                    status?: 'active' | 'inactive'
                    created_at?: string
                    updated_at?: string
                }
            }
            umkm_profiles: {
                Row: {
                    id: number
                    name: string
                    owner_name: string
                    address: string
                    phone: string
                    email: string | null
                    story: string
                    established_year: number | null
                    logo_path: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    owner_name: string
                    address: string
                    phone: string
                    email?: string | null
                    story: string
                    established_year?: number | null
                    logo_path?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    owner_name?: string
                    address?: string
                    phone?: string
                    email?: string | null
                    story?: string
                    established_year?: number | null
                    logo_path?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            product_images: {
                Row: {
                    id: number
                    product_id: number
                    image_path: string
                    alt_text: string | null
                    sort_order: number
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    product_id: number
                    image_path: string
                    alt_text?: string | null
                    sort_order?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    product_id?: number
                    image_path?: string
                    alt_text?: string | null
                    sort_order?: number
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: number
                    product_id: number
                    customer_name: string
                    rating: number
                    comment: string
                    review_images: Json | null
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    product_id: number
                    customer_name: string
                    rating: number
                    comment: string
                    review_images?: Json | null
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    product_id?: number
                    customer_name?: string
                    rating?: number
                    comment?: string
                    review_images?: Json | null
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
