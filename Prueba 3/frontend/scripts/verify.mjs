import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)
const folder = path.join(root, 'docs/evidencias')
fs.mkdirSync(folder, { recursive: true })
const steps = [
  ['vitest', ['node_modules/vitest/vitest.mjs', 'run', '--coverage']],
  ['jasmine', ['scripts/run-jasmine.mjs']],
  ['lint', ['node_modules/eslint/bin/eslint.js', '.']],
  ['build', ['node_modules/vite/bin/vite.js', 'build']],
]
const results = {}
for (const [name, args] of steps) {
  console.log(`Verificando ${name}...`)
  const run = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    maxBuffer: 20 * 1024 * 1024,
  })
  const output = `${run.stdout || ''}\n${run.stderr || ''}`.replace(
    /\u001b\[[0-9;]*m/g,
    '',
  )
  fs.writeFileSync(
    path.join(folder, `${name}.log`),
    output
      .split(root)
      .join('<proyecto>')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trimEnd() + '\n',
  )
  results[name] = { exitCode: run.status }
  if (name === 'vitest')
    results[name].tests = Number(output.match(/Tests\s+(\d+) passed/)?.[1] || 0)
  if (name === 'jasmine')
    results[name].tests = Number(
      [...output.matchAll(/Executed (\d+) of (\d+)/g)].at(-1)?.[1] || 0,
    )
  if (run.status !== 0) {
    console.error(output.slice(-16000))
    process.exit(run.status || 1)
  }
  console.log(`${name}: correcto`)
}
const summary = {
  date: new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date()),
  node: process.version,
  results,
  versions: {},
  coverage: {},
}
for (const name of [
  'react',
  'bootstrap',
  'vite',
  'vitest',
  'jasmine-core',
  'karma',
  'karma-coverage',
])
  summary.versions[name] = JSON.parse(
    fs.readFileSync(`node_modules/${name}/package.json`, 'utf8'),
  ).version
for (const name of ['vitest', 'jasmine']) {
  const source = JSON.parse(
    fs.readFileSync(`coverage/${name}/coverage-summary.json`, 'utf8'),
  )
  const portable = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key === 'total' ? key : path.relative(root, key).replaceAll('\\', '/'),
      value,
    ]),
  )
  fs.writeFileSync(
    path.join(folder, `cobertura-${name}.json`),
    JSON.stringify(portable, null, 2),
  )
  summary.coverage[name] = source.total
}
fs.writeFileSync(
  path.join(folder, 'resumen.json'),
  JSON.stringify(summary, null, 2),
)
console.log(JSON.stringify(summary, null, 2))
