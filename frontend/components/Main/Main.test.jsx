import {h, options, render} from 'preact'
import {expect} from 'chai'

import Main from './Main'
// DOM setup
let $, mount, root, scratch

options.debounceRendering = f => f()

beforeAll(() => {
  $ = sel => scratch.querySelectorAll(sel)
  mount = jsx => root = render(jsx, scratch, root)
  scratch = document.createElement('div')
})

afterEach(() => {
  mount(null).remove()
})

describe('Main component', () => {
  it('has propTypes', () => {
    const component = (
      <Main />
    )
  })
})
