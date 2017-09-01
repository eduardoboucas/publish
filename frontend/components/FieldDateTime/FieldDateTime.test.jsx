import {h, options, render} from 'preact'
import {expect} from 'chai'

import FieldDateTime from './FieldDateTime'
import FieldDateTimeEdit from './FieldDateTimeEdit'
import FieldDateTimeFilter from './FieldDateTimeFilter'

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

describe('FieldDateTimeEdit component', () => {
  it('has propTypes', () => {
    const component = (
      <FieldDateTimeEdit />
    )

    expect(component.nodeName.propTypes).to.exist
    expect(Object.keys(component.nodeName.propTypes)).to.have.length.above(0)
  })
})

describe('FieldDateTimeFilter component', () => {
  it('has propTypes', () => {
    const component = (
      <FieldDateTimeFilter />
    )

    expect(component.nodeName.propTypes).to.exist
    expect(Object.keys(component.nodeName.propTypes)).to.have.length.above(0)
  })
})