'use strict'

import {Component, h} from 'preact'

import Style from 'lib/Style'
import styles from './DocumentListView.css'

import {DocumentRoutes} from 'lib/document-routes'
import {isValidJSON, setPageTitle} from 'lib/util'
import {urlHelper} from 'lib/util/url-helper'

import DocumentList from 'containers/DocumentList/DocumentList'
import DocumentListController from 'containers/DocumentListController/DocumentListController'
import DocumentListToolbar from 'containers/DocumentListToolbar/DocumentListToolbar'
import Header from 'containers/Header/Header'
import Main from 'components/Main/Main'
import Page from 'components/Page/Page'
import ReferencedDocumentHeader from 'containers/ReferencedDocumentHeader/ReferencedDocumentHeader'

export default class DocumentListView extends Component {
  constructor(props) {
    super(props)

    // If we have a valid filter when we mount the component for the first time,
    // then we start with the filters visible by default. Otherwise, they're
    // hidden.
    this.state.newFilter = false
  }

  render() {
    const {
      collection,
      documentId,
      filter,
      group,
      order,
      page,
      referencedField,
      sort,
      state
    } = this.props
    const {newFilter} = this.state

    return (
      <Page>
        {referencedField ?
          <ReferencedDocumentHeader
            collection={collection}
            group={group}
            onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
            documentId={documentId}
            referencedField={referencedField}
          /> : 
          <Header/>
        }

        <Main>
          <div class={styles.container}>
            <DocumentListController
              collection={collection}
              group={group}
              filter={filter}
              newFilter={newFilter}
              onAddNewFilter={this.handleAddNewFilter.bind(this)}
              onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
              documentId={documentId}
              referencedField={referencedField}
            />

            <DocumentList
              collection={collection}
              filter={filter}
              group={group}
              onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
              onPageTitle={this.handlePageTitle}
              order={order}
              page={page}
              documentId={documentId}
              referencedField={referencedField}
              sort={sort}
            />
          </div>        
        </Main>

        <DocumentListToolbar
          collection={collection}
          group={group}
          onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
          referencedField={referencedField}
        />
      </Page>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.collection !== this.props.collection) {
      this.setState({
        newFilter: false
      })
    }
  }

  handleAddNewFilter(isNewFilter) {
    this.setState({
      newFilter: isNewFilter
    })
  }

  handleBuildBaseUrl({
    collection = this.props.collection,
    createNew,
    documentId = this.props.documentId,
    group = this.props.group,
    referenceFieldSelect,
    search = urlHelper().paramsToObject(window.location.search),
    section =  this.props.section
  } = {}) {
    let urlNodes = [
      group,
      collection
    ]

    if (createNew) {
      urlNodes.push('new')
    } else {
      urlNodes.push(documentId)
    }

    if (referenceFieldSelect) {
      urlNodes = urlNodes.concat(['select', referenceFieldSelect])
    } else {
      urlNodes.push(section)
    }

    let url = urlNodes.filter(Boolean).join('/')

    if (search) {
      let searchString = urlHelper().paramsToString(search)

      url += `?${searchString}`
    }

    return `/${url}`
  } 

  handlePageTitle(title) {
    // We could have containers calling `setPageTitle()` directly, but it should
    // be up to the views to control the page title, otherwise we'd risk having
    // multiple containers wanting to set their own titles. Instead, containers
    // have a `onPageTitle` callback that they fire whenever they want to set
    // the title of the page. It's then up to the parent view to decide which
    // of those callbacks will set the title.

    setPageTitle(title)
  }
}
