import type { Address } from 'ox'

export function isSafari() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('safari') && !ua.includes('chrome')
}

export function isFirefox() {
  return navigator.userAgent.toLowerCase().includes('firefox')
}

export function isMobile() {
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent,
  )
}

export function isFirefoxAndroid() {
  return isFirefox() && isMobile()
}

const FIREFOX_ANDROID_STORAGE_KEY = 'porto.firefoxAndroid.addressMapping'

export function storeAddressForCredential(
  credentialId: string,
  address: string,
) {
  if (!isFirefoxAndroid()) return

  try {
    const stored = localStorage.getItem(FIREFOX_ANDROID_STORAGE_KEY)
    const mapping = stored ? JSON.parse(stored) : {}
    mapping[credentialId] = address
    localStorage.setItem(FIREFOX_ANDROID_STORAGE_KEY, JSON.stringify(mapping))
  } catch (error) {
    console.warn('Failed to store Firefox Android address mapping:', error)
  }
}

export function getAddressForCredential(
  credentialId: string,
): Address.Address | null {
  if (!isFirefoxAndroid()) return null

  try {
    const stored = localStorage.getItem(FIREFOX_ANDROID_STORAGE_KEY)
    if (!stored) return null
    const mapping = JSON.parse(stored)
    return mapping[credentialId] || null
  } catch (error) {
    console.warn('Failed to retrieve Firefox Android address mapping:', error)
    return null
  }
}
