export function isSafari() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('safari') && !ua.includes('chrome')
}

export function isFirefox() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('firefox')
}

export function isMobile() {
  return (
    navigator.maxTouchPoints > 1 ||
    Boolean((navigator as any)?.userAgentData?.mobile) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  )
}

export function isAndroid() {
  return (
    navigator.platform.toLowerCase().includes('android') ||
    /Android|BlackBerry|Opera Mini/i.test(navigator.userAgent)
  )
}
