'use strict'

import {h, Component} from 'preact'
import {bindActionCreators} from 'redux'
import {connectHelper, setPageTitle} from 'lib/util'
import {URLParams} from 'lib/util/urlParams'

import DocumentEdit from 'containers/DocumentEdit/DocumentEdit'
import DocumentEditToolbar from 'containers/DocumentEditToolbar/DocumentEditToolbar'
import Header from 'containers/Header/Header'
import Main from 'components/Main/Main'
import Page from 'components/Page/Page'

class DocumentEditView extends Component {
  render() {
    const {
      collection,
      documentId,
      group,
      referencedField,
      section,
      state
    } = this.props
    const {currentApi, currentCollection} = state.api

    return (
      <Page>
        <Header/>

        <DocumentEditToolbar
          api={currentApi}
          collection={currentCollection}
          documentId={documentId}
          onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
          referencedField={referencedField}
          section={section}
        />

        <Main>
          <DocumentEdit
            api={currentApi}
            collection={currentCollection}
            documentId={documentId}
            onBuildBaseUrl={this.handleBuildBaseUrl.bind(this)}
            onPageTitle={this.handlePageTitle}
            referencedField={referencedField}
            section={section}
          />
        </Main>
        
      </Page>
    )
  }

  handleBuildBaseUrl ({
    collection = this.props.collection,
    createNew,
    documentId = this.props.documentId,
    group = this.props.group,
    referenceFieldSelect,
    search = new URLParams(window.location.search).toObject(),
    section = this.props.section
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

    if (search && Object.keys(search).length > 0) {
      url += `?${new URLParams(search).toString()}`
    }

    return `/${url}`
  }

  handlePageTitle (title) {
    // View should always control page title, as it has a direct relationship to route
    setPageTitle(title)
  }
}

export default connectHelper(
  state => ({
    api: state.api
  })
)(DocumentEditView)
