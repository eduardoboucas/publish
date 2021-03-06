import proptypes from 'prop-types'
import React from 'react'
import styles from './Toggle.css'

/**
 * A toggle input element.
 */
export default class Toggle extends React.Component {
  static propTypes = {
    /**
     * The ID of the input element.
     */
    id: proptypes.string,

    /**
     * The name of the input element.
     */
    name: proptypes.string,

    /**
     * A callback function to be fired whenever the value changes.
     */
    onChange: proptypes.func,

    /**
     * Whether the field is read-only.
     */
    readOnly: proptypes.bool,

    /**
     * The value of the checkbox, determining whether it's checked or not.
     */
    value: proptypes.bool
  }

  render() {
    const {id, name, onChange, readOnly, value} = this.props

    return (
      <input
        checked={value}
        className={styles.checkbox}
        disabled={readOnly}
        id={id}
        name={name}
        onChange={onChange}
        type="checkbox"
      />
    )
  }
}
