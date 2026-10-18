import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { build } from 'esbuild'
import { transformAsync } from '@babel/core'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)
await fs.mkdir('.karma', { recursive: true })
await build({
  entryPoints: ['tests/jasmine/components.jasmine.jsx'],
  outfile: '.karma/specs.js',
  bundle: true,
  format: 'iife',
  platform: 'browser',
  jsx: 'automatic',
  sourcemap: true,
  define: { 'process.env.NODE_ENV': '"test"' },
  loader: { '.css': 'empty', '.svg': 'text' },
  alias: { vitest: path.join(root, 'tests/jasmine/compat.js') },
  plugins: [
    {
      name: 'coverage',
      setup(builder) {
        builder.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
          if (
            args.path.includes('.test.jsx') &&
            args.path.startsWith(path.join(root, 'src'))
          ) {
            const source = await fs.readFile(args.path, 'utf8')
            const result = await transformAsync(source, {
              filename: args.path,
              babelrc: false,
              configFile: false,
              plugins: [
                ({ types: t }) => ({
                  visitor: {
                    Program(program) {
                      const imports = program.node.body.filter((node) =>
                        t.isImportDeclaration(node),
                      )
                      const body = program.node.body.filter(
                        (node) => !t.isImportDeclaration(node),
                      )
                      program.node.body = [
                        ...imports,
                        t.expressionStatement(
                          t.callExpression(t.identifier('describe'), [
                            t.stringLiteral(path.relative(root, args.path)),
                            t.arrowFunctionExpression(
                              [],
                              t.blockStatement(body),
                            ),
                          ]),
                        ),
                      ]
                    },
                  },
                }),
                ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
              ],
            })
            return { contents: result.code, loader: 'js' }
          }
          if (!args.path.startsWith(path.join(root, 'src'))) return
          const result = await transformAsync(
            await fs.readFile(args.path, 'utf8'),
            {
              filename: args.path,
              babelrc: false,
              configFile: false,
              sourceMaps: 'inline',
              plugins: [
                ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
                [
                  'babel-plugin-istanbul',
                  {
                    cwd: root,
                    include: ['src/**/*.{js,jsx}'],
                    exclude: ['**/*.test.*'],
                  },
                ],
              ],
            },
          )
          return { contents: result.code, loader: 'js' }
        })
      },
    },
  ],
})
const chrome = [
  process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((value) => value && existsSync(value))
const child = spawn(
  process.execPath,
  ['node_modules/karma/bin/karma', 'start', 'karma.conf.cjs'],
  {
    stdio: 'inherit',
    env: { ...process.env, ...(chrome ? { CHROME_BIN: chrome } : {}) },
  },
)
child.on('exit', (code) => process.exit(code || 0))
child.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})
