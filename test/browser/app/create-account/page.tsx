'use client'

import { porto } from '@/config'
import { useState } from 'react'

export default function Page() {
  const [result, setResult] = useState<string | null>(null)
  return (
    <main>
      <h1>experimental_createAccount</h1>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_createAccount' })
            .then(setResult)
        }
        type="button"
      >
        Register
      </button>
      {result && <div>{result}</div>}
    </main>
  )
}
