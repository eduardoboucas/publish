'use strict'

import { h, Component } from 'preact'

import styles from './FieldLabel.css'
import { getUniqueId } from 'lib/util'

export default class FieldLabel extends Component {
  componentWillMount () {
    this.id = getUniqueId()
  }

  // This will render all children and inject an `id` prop
  // with the generated unique id
  renderChildren() {
    return this.props.children.map(child => {
      child.attributes = child.attributes || {}
      child.attributes.id = child.attributes.id || this.id

      return child
    })
  }  

  render() {
    return (
      <div class={styles.container}>
        <label for={this.id} class={styles.label}>{this.props.label}</label>

        {this.props.comment &&
          <sub class={styles.comment}>{this.props.comment}</sub>
        }

        {this.renderChildren()}
      </div>
    )
  }
}