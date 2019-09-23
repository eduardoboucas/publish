import * as fieldComponents from 'lib/field-components'
import {connectRedux} from 'lib/redux'
import {ExpandMore} from '@material-ui/icons'
import {getFieldType} from 'lib/fields'
import proptypes from 'prop-types'
import React from 'react'
import Style from 'lib/Style'
import styles from './DocumentTableList.css'
import SyncTable from 'components/SyncTable/SyncTable'

/**
 * A table view for listing documents.
 */
class DocumentTableList extends React.Component {
  static propTypes = {
    /**
     * The collection to operate on.
     */
    collection: proptypes.object,

    /**
     * The list of documents to display.
     */
    documents: proptypes.array,

    /**
     * The list of fields to display.
     */
    fields: proptypes.array,

    /**
     * A callback to be used to obtain the base URL for the given page, as
     * determined by the view.
     */
    onBuildBaseUrl: proptypes.func,

    /**
     * A callback to be fired with a new document selection.
     */
    onSelect: proptypes.func,

    /**
     * The order used to sort the documents by the `sort` field.
     */
    order: proptypes.oneOf(['asc', 'desc']),

    /**
     * A hash map of the indices of the currently selected documents.
     */
    selectedDocuments: proptypes.object,

    /**
     * The maximum number of documents that can be selected.
     */
    selectLimit: proptypes.number,

    /**
     * The name of the field currently being used to sort the documents.
     */
    sort: proptypes.string,

    /**
     * The text to show as the table's subtitle.
     */
    subtitle: proptypes.string,

    /**
     * The text to show as the table's title.
     */
    title: proptypes.string
  }

  constructor(props) {
    super(props)

    this.renderColumnHeader = this.renderColumnHeader.bind(this)
  }

  getSelectedRows() {
    const {documents, selectedDocuments} = this.props
    const selectedRows = documents.reduce((selectedRows, item, index) => {
      if (selectedDocuments[item._id]) {
        selectedRows[index] = true
      }

      return selectedRows
    }, {})

    return selectedRows
  }

  handleRowRender(listableFields, value, data, column, index) {
    const {collection, documentId, onBuildBaseUrl, referencedField} = this.props

    // If we're on a nested document view, we don't want to add links to
    // documents (for now).
    if (referencedField) {
      return value
    }

    const editLink = onBuildBaseUrl({
      documentId: documentId || data._id,
      search: null
    })
    const fieldSchema = collection.fields[column.id]
    const renderedValue = this.renderField({
      document: data,
      fieldName: column.id,
      schema: fieldSchema
    })
    const firstStringField = Object.keys(listableFields).find(field => {
      return listableFields[field].type === 'String'
    })

    if (
      (firstStringField && firstStringField === column.id) ||
      (!firstStringField && index === 0)
    ) {
      return React.cloneElement(renderedValue, {internalLink: editLink})
    }

    return renderedValue
  }

  renderColumnHeader(column) {
    const {sort: sortBy, order: sortOrder} = this.props
    const isSorted = sortBy === column.id
    const newOrder = isSorted && sortOrder === 'asc' ? 'desc' : 'asc'
    const headerStyle = new Style(styles, 'column-header').addIf(
      'sorted',
      isSorted
    )

    const iconStyle = new Style(styles, 'arrow').addIf(
      'up',
      isSorted && sortOrder === 'desc'
    )

    return (
      <a
        className={headerStyle.getClasses()}
        data-column={sortBy}
        data-name="column-header"
        data-sort-order={newOrder}
        onClick={() =>
          this.props.onSort({sortBy: column.id, sortOrder: newOrder})
        }
      >
        {column.label}
        <ExpandMore className={iconStyle.getClasses()} />
      </a>
    )
  }

  render() {
    const {
      collection,
      documents,
      fields: fieldsToDisplay = [],
      onSelect,
      order,
      selectedDocuments,
      sort,
      subtitle,
      title
    } = this.props
    const collectionFields = (collection && collection.fields) || {}
    const listableFields = fieldsToDisplay.reduce((fields, fieldName) => {
      if (collectionFields[fieldName]) {
        fields[fieldName] = collectionFields[fieldName]
      }

      return fields
    }, {})
    const tableColumns = Object.keys(listableFields).map(field => {
      if (!collection.fields[field]) return undefined

      return {
        id: field,
        label: collection.fields[field].label || field
      }
    })

    return (
      <>
        <h1 className={styles.title}>{title}</h1>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles['table-wrapper']}>
          <SyncTable
            columns={tableColumns}
            data={documents}
            onRender={this.handleRowRender.bind(this, listableFields)}
            onSelect={onSelect}
            renderColumnHeader={this.renderColumnHeader}
            selectedRows={selectedDocuments}
            selectLimit={Infinity}
            sortable={true}
            sortBy={sort}
            sortOrder={order}
          />
          <div className={styles.after} />
        </div>
      </>
    )
  }

  renderField({document, fieldName, schema}) {
    if (!schema) return

    const value = document[fieldName]
    const {collection, state} = this.props
    const {config} = state.app
    const {api} = config

    let FieldComponentList

    // In some cases, we might want to tap into the collection schema and add
    // a custom `FieldComponentList` function to a given field, which will
    // override whatever component is set to render the list view of the
    // field's type.
    if (typeof schema.FieldComponentList === 'function') {
      FieldComponentList = schema.FieldComponentList
    } else {
      const fieldType = getFieldType(schema)
      const fieldComponentName = `Field${fieldType}`

      FieldComponentList =
        fieldComponents[fieldComponentName] &&
        fieldComponents[fieldComponentName].list
    }

    if (FieldComponentList) {
      return (
        <FieldComponentList
          api={api}
          config={config}
          collection={collection}
          document={document}
          fieldName={fieldName}
          schema={schema}
          value={value}
        />
      )
    }

    return value
  }
}

export default connectRedux()(DocumentTableList)
