import { execSync } from 'node:child_process'
import { randomInt } from 'node:crypto'

function isPortInUse(port: number): boolean {
  try {
    // On Unix-like systems, we can use netstat to check if a port is in use
    execSync(`lsof -i :${port}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function findAvailablePort(): number {
  while (true) {
    // Generate a random port in the range 3000-6553
    const port = randomInt(3000, 6554)

    // Skip ports 5173 and 5174
    if (port !== 5173 && port !== 5174) {
      if (!isPortInUse(port)) {
        return port
      }
    }
  }
}

export function getRandomPort(): number {
  // Check if USE_RANDOM_PORT is set to true
  if (process.env.USE_RANDOM_PORT !== 'true') {
    console.log('USE_RANDOM_PORT is not set to true')
    return 0
  }

  // Check if lsof is available
  try {
    execSync('which lsof', { stdio: 'ignore' })
  } catch {
    console.log('lsof could not be found')
    throw new Error('lsof is required but not found')
  }

  const port = findAvailablePort()
  console.log(port)
  return port
}
