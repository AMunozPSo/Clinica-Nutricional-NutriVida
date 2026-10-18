// Ejecuta los casos compartidos en Jasmine; no carga Vitest en el navegador.
export const describe = globalThis.describe
export const beforeEach = globalThis.beforeEach
export const afterEach = globalThis.afterEach
export const expect = globalThis.expect
export const it = Object.assign((name, fn) => globalThis.it(name, fn), {
  each: (rows) => (name, fn) =>
    rows.forEach((row) => {
      let index = 0
      globalThis.it(
        name.replace(/%s/g, () => String(row[index++])),
        () => fn(...row),
      )
    }),
})
export const vi = {
  spyOn(object, key) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key)
    const spy = globalThis.spyOn(object, key)
    return {
      mockImplementation(fn) {
        spy.and.callFake(fn)
        return this
      },
      mockRestore() {
        Object.defineProperty(object, key, descriptor)
      },
    }
  },
}
const subset = (actual, expected) =>
  expected && typeof expected === 'object'
    ? Object.keys(expected).every((key) => subset(actual?.[key], expected[key]))
    : actual === expected
beforeEach(() => {
  globalThis.jasmine.addMatchers({
    toBeInTheDocument: () => ({
      compare: (actual) => ({
        pass: !!actual?.ownerDocument?.contains(actual),
        message: 'Se esperaba un elemento presente en el DOM.',
      }),
    }),
    toHaveTextContent: () => ({
      compare: (actual, expected) => ({
        pass:
          expected instanceof RegExp
            ? expected.test(actual?.textContent || '')
            : (actual?.textContent || '')
                .replace(/\s+/g, ' ')
                .includes(String(expected)),
        message: `No se encontró el texto esperado ${expected}.`,
      }),
    }),
    toHaveAttribute: () => ({
      compare: (actual, key, value) => ({
        pass:
          value === undefined
            ? actual?.hasAttribute(key)
            : actual?.getAttribute(key) === value,
      }),
    }),
    toHaveValue: () => ({
      compare: (actual, expected) => ({ pass: actual?.value === expected }),
    }),
    toBeDisabled: () => ({
      compare: (actual) => ({ pass: !!actual?.disabled }),
    }),
    toHaveLength: () => ({
      compare: (actual, expected) => ({ pass: actual?.length === expected }),
    }),
    toMatchObject: () => ({
      compare: (actual, expected) => ({
        pass: subset(actual, expected),
        message: 'El objeto no contiene los valores esperados.',
      }),
    }),
    toHaveProperty: () => ({
      compare: (actual, key) => ({
        pass: Object.prototype.hasOwnProperty.call(actual || {}, key),
      }),
    }),
    toThrow: () => ({
      compare: (fn, expected) => {
        try {
          fn()
          return { pass: false, message: 'Se esperaba una excepción.' }
        } catch (error) {
          return {
            pass:
              expected === undefined ||
              (expected instanceof RegExp
                ? expected.test(error.message)
                : error.message.includes(expected)),
            message: `Excepción recibida: ${error.message}`,
          }
        }
      },
    }),
  })
})
