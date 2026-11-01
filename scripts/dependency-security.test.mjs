import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
// eslint-disable-next-line test/no-import-node-test -- Use Node's built-in runner without adding a test framework.
import { test } from 'node:test'

const require = createRequire(import.meta.url)
const pluginRequire = createRequire(require.resolve('@sveltejs/vite-plugin-svelte'))
const merge = pluginRequire('deepmerge')
const payload = () => JSON.parse('{"__proto__":{"polluted":true},"safe":42}')

function assertSafe(value) {
  assert.equal(Object.getPrototypeOf(value), Object.prototype)
  assert.equal(value.polluted, undefined)
  assert.equal({}.polluted, undefined)
}

test('merging into a null-prototype dictionary preserves a safe prototype', () => {
  const result = merge(Object.create(null), payload())
  assertSafe(result)
  assert.equal(result.safe, 42)
})

test('copying a target with an own __proto__ key preserves a safe prototype', () => {
  const result = merge(payload(), { added: true })
  assertSafe(result)
  assert.equal(result.safe, 42)
  assert.equal(result.added, true)
})

test('nested objects and array entries retain safe prototypes', () => {
  const result = merge({}, { nested: payload(), list: [payload()] })
  assertSafe(result.nested)
  assertSafe(result.list[0])
  assert.equal(result.nested.safe, 42)
})

test('ordinary nested options, arrays and enumerable symbols still merge', () => {
  const key = Symbol('option')
  const result = merge({ options: { left: true }, list: [1], [key]: 42 }, { options: { right: true }, list: [2] })
  assert.deepEqual(result.options, { left: true, right: true })
  assert.deepEqual(result.list, [1, 2])
  assert.equal(result[key], 42)
})
