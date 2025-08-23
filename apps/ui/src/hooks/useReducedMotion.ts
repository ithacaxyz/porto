// thanks motiondivision/motion
// https://github.com/motiondivision/motion/blob/e0f7e07570e281b8932c897afb5f6a348c7f97de/packages/framer-motion/src/utils/reduced-motion/

import { useEffect, useState } from 'react'

const prefersReducedMotion = { current: null as boolean | null }
const hasReducedMotionListener = { current: false }

function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true
  if (!window.matchMedia) {
    prefersReducedMotion.current = false
    return
  }
  const motionMediaQuery = window.matchMedia('(prefers-reduced-motion)')
  const setReducedMotionPreferences = () => {
    prefersReducedMotion.current = motionMediaQuery.matches
  }
  motionMediaQuery.addEventListener('change', setReducedMotionPreferences)
  setReducedMotionPreferences()
}

export function useReducedMotion() {
  if (!hasReducedMotionListener.current) initPrefersReducedMotion()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(
    prefersReducedMotion.current ?? false,
  )
  useEffect(() => {
    if (!window.matchMedia) return
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion)')
    const handleChange = () => {
      prefersReducedMotion.current = motionMediaQuery.matches
      setShouldReduceMotion(motionMediaQuery.matches)
    }
    motionMediaQuery.addEventListener('change', handleChange)
    return () => motionMediaQuery.removeEventListener('change', handleChange)
  }, [])
  return shouldReduceMotion
}
