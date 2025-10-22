#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { platform } from 'node:os'
import * as path from 'node:path'

interface BenchmarkResult {
  name: string
  timeSeconds: number
  peakMemoryMB?: number
  cpuTimeSeconds?: number
  error?: string
}

interface BenchmarkReport {
  timestamp: string
  gitCommit: string
  nodeVersion: string
  pnpmVersion: string
  platform: string
  results: BenchmarkResult[]
}

const isLinux = platform() === 'linux'
const isMacOS = platform() === 'darwin'

async function runCommand(
  command: string,
  args: string[],
  options: {
    timeout?: number
    watchForReady?: boolean
    readyPattern?: RegExp
  } = {},
): Promise<BenchmarkResult> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    let output = ''
    let errorOutput = ''
    let isReady = false

    // Wrap with time command for memory tracking
    const timeCmd = isMacOS ? '/usr/bin/time' : isLinux ? '/usr/bin/time' : null
    const timeArgs = isMacOS ? ['-l'] : isLinux ? ['-v'] : []

    let actualCommand: string
    let actualArgs: string[]

    if (timeCmd) {
      actualCommand = timeCmd
      actualArgs = [...timeArgs, command, ...args]
    } else {
      actualCommand = command
      actualArgs = args
    }

    const child = spawn(actualCommand, actualArgs, {
      stdio: 'pipe',
      shell: false,
      detached: true, // Create process group for easier cleanup
    })

    child.stdout?.on('data', (data) => {
      const text = data.toString()
      output += text

      if (options.watchForReady && options.readyPattern && !isReady) {
        if (options.readyPattern.test(text)) {
          isReady = true
          const endTime = performance.now()
          const timeSeconds = (endTime - startTime) / 1000

          // Kill the entire process group
          if (child.pid) {
            try {
              process.kill(-child.pid, 'SIGKILL')
            } catch {
              child.kill('SIGKILL')
            }
          } else {
            child.kill('SIGKILL')
          }

          resolve({
            name: 'Dev Server Startup',
            timeSeconds,
          })
        }
      }
    })

    child.stderr?.on('data', (data) => {
      errorOutput += data.toString()
    })

    child.on('close', (code) => {
      const endTime = performance.now()
      const timeSeconds = (endTime - startTime) / 1000

      // Parse memory stats from time output
      let peakMemoryMB: number | undefined
      let cpuTimeSeconds: number | undefined

      if (isMacOS) {
        // Parse macOS time -l output
        const memMatch = errorOutput.match(/maximum resident set size\s+(\d+)/)
        if (memMatch?.[1]) {
          // macOS reports in bytes
          peakMemoryMB = Number.parseInt(memMatch[1], 10) / (1024 * 1024)
        }

        const cpuMatch = errorOutput.match(
          /(\d+\.\d+) user\s+(\d+\.\d+) system/,
        )
        if (cpuMatch?.[1] && cpuMatch?.[2]) {
          cpuTimeSeconds =
            Number.parseFloat(cpuMatch[1]) + Number.parseFloat(cpuMatch[2])
        }
      } else if (isLinux) {
        // Parse Linux time -v output
        const memMatch = errorOutput.match(
          /Maximum resident set size \(kbytes\): (\d+)/,
        )
        if (memMatch?.[1]) {
          peakMemoryMB = Number.parseInt(memMatch[1], 10) / 1024
        }

        const userMatch = errorOutput.match(/User time \(seconds\): (\d+\.\d+)/)
        const sysMatch = errorOutput.match(
          /System time \(seconds\): (\d+\.\d+)/,
        )
        if (userMatch?.[1] && sysMatch?.[1]) {
          cpuTimeSeconds =
            Number.parseFloat(userMatch[1]) + Number.parseFloat(sysMatch[1])
        }
      }

      if (options.watchForReady && !isReady) {
        // Timeout reached without ready signal
        resolve({
          name: 'Dev Server Startup',
          timeSeconds,
          error: 'Timeout: Ready signal not detected',
        })
      } else if (!options.watchForReady) {
        resolve({
          name: 'Command',
          timeSeconds,
          peakMemoryMB,
          cpuTimeSeconds,
          error: code !== 0 ? `Exit code: ${code}` : undefined,
        } as BenchmarkResult)
      }
    })

    if (options.timeout) {
      setTimeout(() => {
        if (!isReady && child.pid) {
          try {
            process.kill(-child.pid, 'SIGKILL')
          } catch {
            child.kill('SIGKILL')
          }
        }
      }, options.timeout)
    }
  })
}

function getGitInfo(): { commit: string; branch: string } {
  try {
    const commit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
    }).trim()
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim()
    return { commit, branch }
  } catch {
    return { commit: 'unknown', branch: 'unknown' }
  }
}

function getVersions(): { node: string; pnpm: string } {
  const node = process.version
  let pnpm = 'unknown'
  try {
    pnpm = execSync('pnpm --version', { encoding: 'utf-8' }).trim()
  } catch {
    // Ignore
  }
  return { node, pnpm }
}

function formatBytes(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`
  }
  return `${mb.toFixed(0)} MB`
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs.toFixed(0)}s`
}

function generateMarkdownReport(report: BenchmarkReport): string {
  const { commit, branch } = getGitInfo()

  let md = '# Performance Benchmark Report\n\n'
  md += `**Date**: ${report.timestamp}\n\n`
  md += `**Git**: \`${commit}\` (${branch})\n\n`
  md += `**Node**: ${report.nodeVersion}\n\n`
  md += `**pnpm**: ${report.pnpmVersion}\n\n`
  md += `**Platform**: ${report.platform}\n\n`
  md += '---\n\n'

  for (const result of report.results) {
    md += `## ${result.name}\n\n`

    if (result.error) {
      md += `⚠️  **Error**: ${result.error}\n\n`
    }

    md += `- **Time**: ${formatTime(result.timeSeconds)}\n`

    if (result.peakMemoryMB !== undefined) {
      md += `- **Peak Memory**: ${formatBytes(result.peakMemoryMB)}\n`
    }

    if (result.cpuTimeSeconds !== undefined) {
      md += `- **CPU Time**: ${formatTime(result.cpuTimeSeconds)}\n`
    }

    md += '\n'
  }

  return md
}

async function main() {
  console.log('🚀 Starting Porto Performance Benchmark\n')

  const versions = getVersions()
  const { commit, branch } = getGitInfo()

  console.log(`Platform: ${platform()}`)
  console.log(`Git: ${commit} (${branch})`)
  console.log(`Node: ${versions.node}`)
  console.log(`pnpm: ${versions.pnpm}\n`)

  if (!isMacOS && !isLinux) {
    console.warn('⚠️  Memory metrics are only available on macOS and Linux')
  }

  const results: BenchmarkResult[] = []

  // 1. TypeScript Type Check
  console.log('📝 Running TypeScript type check...')
  const typeCheckResult = await runCommand(
    'pnpm',
    ['run', '--recursive', '--parallel', 'check:types'],
    {},
  )
  typeCheckResult.name = 'TypeScript Type Check'
  results.push(typeCheckResult)
  console.log(`   ✓ Completed in ${formatTime(typeCheckResult.timeSeconds)}\n`)

  // 2. Build
  console.log('🔨 Running build...')
  console.log('   (Cleaning first...)')
  try {
    execSync('pnpm clean', { stdio: 'ignore' })
  } catch {
    // Ignore clean errors
  }
  const buildResult = await runCommand('pnpm', ['build'], {})
  buildResult.name = 'Build'
  results.push(buildResult)
  console.log(`   ✓ Completed in ${formatTime(buildResult.timeSeconds)}\n`)

  // 3. Install (clean)
  console.log('📦 Running clean install...')
  console.log('   (Removing node_modules...)')
  try {
    execSync(
      'rm -rf node_modules apps/*/node_modules examples/*/node_modules',
      { stdio: 'ignore' },
    )
  } catch {
    // Ignore removal errors
  }
  const installResult = await runCommand('pnpm', ['install'], {})
  installResult.name = 'Install (clean)'
  results.push(installResult)
  console.log(`   ✓ Completed in ${formatTime(installResult.timeSeconds)}\n`)

  // 4. Dev Server Startup
  console.log('🌐 Measuring dev server startup...')
  // Run preconstruct first
  try {
    execSync('pnpm preconstruct', { stdio: 'ignore' })
  } catch {
    // Ignore
  }
  const devResult = await runCommand('pnpm', ['dev'], {
    timeout: 60000, // 60 second timeout
    watchForReady: true,
    readyPattern: /Local:.*http|ready in|VITE.*ready/i,
  })
  results.push(devResult)
  if (devResult.error) {
    console.log(`   ⚠️  ${devResult.error}\n`)
  } else {
    console.log(`   ✓ Ready in ${formatTime(devResult.timeSeconds)}\n`)
  }

  // Generate report
  const timestamp = new Date().toISOString()
  const report: BenchmarkReport = {
    timestamp,
    gitCommit: commit,
    nodeVersion: versions.node,
    pnpmVersion: versions.pnpm,
    platform: platform(),
    results,
  }

  const reportId = timestamp.replace(/[:.]/g, '-')
  const jsonFile = `benchmark-results-${reportId}.json`
  const mdFile = `benchmark-results-${reportId}.md`

  // write to `$REPO_ROOT/_/bench/`
  const benchDir = path.join(process.cwd(), '_', 'bench')
  if (!existsSync(benchDir)) mkdirSync(benchDir, { recursive: true })

  const jsonPath = path.join(benchDir, jsonFile)
  const mdPath = path.join(benchDir, mdFile)

  writeFileSync(jsonPath, JSON.stringify(report, null, 2))
  console.log(`📊 Results saved to: ${jsonPath}`)

  const markdown = generateMarkdownReport(report)
  writeFileSync(mdPath, markdown)
  console.log(`📄 Report saved to: ${mdPath}`)

  console.log('\n' + markdown)

  // Exit explicitly to prevent hanging
  process.exit(0)
}

main().catch((error) => {
  console.error('Error running benchmark:', error)
  process.exit(1)
})
