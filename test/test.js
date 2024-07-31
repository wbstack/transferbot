#!/usr/bin/env node

import assert from 'assert'
import test from 'node:test'

import { pickKeys, pickLanguages } from './../lib/util.js'

test('util.pickKeys', async t => {
    await t.test('empty', t => {
        assert.deepStrictEqual(pickKeys({}), {})
    })
    await t.test('picks keys', t => {
        const result = pickKeys({
            foo: 'bar',
            baz: {
                foo: 'bar',
            },
            qux: 12
        }, 'baz', 'qux')

        assert.deepStrictEqual(result, {
            baz: {
                foo: 'bar'
            },
            qux: 12
        })
    })
})

test('util.pickLanguages', async t => {
    await t.test('empty', t => {
        assert.deepStrictEqual(pickLanguages({}), {})
    })

    await t.test('skip languages', t => {
        const result = pickLanguages({
            labels: {
                en: {
                    language: 'en',
                    value: 'pipe',
                },
                fr: {
                    language: 'fr',
                    value: 'pipe',
                },
                de: {
                    language: 'de',
                    value: 'Pfeife',
                }
            }
        }, 'en', 'fr')

        assert.deepStrictEqual(result, {
            labels: {
                en: {
                    language: 'en',
                    value: 'pipe',
                },
                fr: {
                    language: 'fr',
                    value: 'pipe',
                }
            }
        })
    })
})
