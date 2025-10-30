type NativeRequire = (moduleId: string) => unknown

let resolvedNativeRequire: NativeRequire | null | undefined

const getNativeRequire = (): NativeRequire | null => {
  if (resolvedNativeRequire !== undefined) return resolvedNativeRequire

  const globalRequire = (globalThis as { require?: NativeRequire }).require
  if (typeof globalRequire === 'function') {
    resolvedNativeRequire = globalRequire
    return resolvedNativeRequire
  }

  try {
    // Using Function constructor to access `require` when it exists (e.g. Metro).
    resolvedNativeRequire = Function(
      'return typeof require === "function" ? require : null',
    )() as NativeRequire | null
  } catch {
    resolvedNativeRequire = null
  }

  return resolvedNativeRequire ?? null
}

export function loadNativeModule<TModule>(
  moduleId: string,
): TModule | null | undefined {
  const nativeRequire = getNativeRequire()
  if (!nativeRequire) return null
  try {
    return nativeRequire(moduleId) as TModule
  } catch {
    return null
  }
}
