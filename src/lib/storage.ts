import { ShortenedUrl } from '@/types'
import { supabase } from './supabase'

const LOCAL_CODES_KEY = 'urlgpt_my_codes'
const MAX_URLS = 11

// Store only the codes of URLs created by this user/device
export function getMyUrlCodes(): string[] {
  try {
    const stored = localStorage.getItem(LOCAL_CODES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading codes from localStorage:', error)
    return []
  }
}

export function addMyUrlCode(code: string): void {
  try {
    const codes = getMyUrlCodes()
    codes.unshift(code)
    const trimmedCodes = codes.slice(0, MAX_URLS)
    localStorage.setItem(LOCAL_CODES_KEY, JSON.stringify(trimmedCodes))
  } catch (error) {
    console.error('Error saving code to localStorage:', error)
  }
}

export function removeMyUrlCode(code: string): void {
  try {
    const codes = getMyUrlCodes()
    const filtered = codes.filter(c => c !== code)
    localStorage.setItem(LOCAL_CODES_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing code from localStorage:', error)
  }
}

// Fetch URLs created by this user/device from Supabase
export async function getShortenedUrls(): Promise<ShortenedUrl[]> {
  try {
    const myCodes = getMyUrlCodes()
    
    if (myCodes.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('shortened_urls')
      .select('*')
      .in('code', myCodes)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(row => ({
      id: row.id,
      code: row.code,
      originalUrl: row.original_url,
      shortUrl: `${window.location.origin}/${row.code}`,
      createdAt: row.created_at,
    }))
  } catch (error) {
    console.error('Error fetching URLs from Supabase:', error)
    return []
  }
}

export async function saveShortenedUrl(code: string, originalUrl: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('shortened_urls')
      .insert({
        code,
        original_url: originalUrl,
      })

    if (error) throw error

    // Track this code locally
    addMyUrlCode(code)
  } catch (error) {
    console.error('Error saving URL to Supabase:', error)
    throw new Error('Failed to save URL')
  }
}

export async function deleteShortenedUrl(code: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('shortened_urls')
      .delete()
      .eq('code', code)

    if (error) throw error

    // Remove from local tracking
    removeMyUrlCode(code)
  } catch (error) {
    console.error('Error deleting URL from Supabase:', error)
    throw new Error('Failed to delete URL')
  }
}

export async function findUrlByCode(code: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('shortened_urls')
      .select('original_url')
      .eq('code', code)
      .single()

    if (error) throw error

    return data?.original_url || null
  } catch (error) {
    console.error('Error finding URL by code:', error)
    return null
  }
}

export function getUrlCount(): number {
  return getMyUrlCodes().length
}

export function isAtMaxCapacity(): boolean {
  return getUrlCount() >= MAX_URLS
}
