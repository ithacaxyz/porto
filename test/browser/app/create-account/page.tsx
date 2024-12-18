'use client'

import { Porto } from 'porto'
import { useState } from 'react'

const porto = Porto.create()

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
