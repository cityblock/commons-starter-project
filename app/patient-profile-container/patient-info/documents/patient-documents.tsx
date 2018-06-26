import { ApolloError } from 'apollo-client';
import { find } from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import Loadable from 'react-loadable';
import patientDocumentsGraphql from '../../../graphql/queries/get-patient-documents.graphql';
import patientDocumentSubscriptionGraphql from '../../../graphql/queries/patient-document-subscription.graphql';
import { getPatientDocuments, DocumentTypeOptions } from '../../../graphql/types';
import styles from './css/patient-documents.css';
import DocumentPlaceholder from './document-placeholder';
import PatientDocument from './patient-document';
import { patientDocumentsUpdateQuery } from './update-queries/patient-documents';

const CONSENTS = [
  DocumentTypeOptions.cityblockConsent,
  DocumentTypeOptions.hipaaConsent,
  DocumentTypeOptions.hieHealthixConsent,
  DocumentTypeOptions.textConsent,
];

interface IProps {
  patientId: string;
  hasMolst?: boolean | null;
  hasHealthcareProxy?: boolean | null;
  closePopup: () => void;
  isModalVisible: boolean;
}

interface IGraphqlProps {
  patientDocuments?: getPatientDocuments['patientDocuments'];
  isLoading: boolean;
  error: ApolloError | null | undefined;
  subscribeToMore: ((args: any) => () => void) | null;
}

export type allProps = IGraphqlProps & IProps;

export const LoadableDocumentsModal = (Loadable as any)({
  loader: async () =>
    import(/* webpackChunkName: "patient-document-modal" */ './patient-document-modal'),
  loading: () => null,
});

interface IState {
  modalDocumentType?: DocumentTypeOptions | null;
}

class PatientDocuments extends React.Component<allProps, IState> {
  state = { modalDocumentType: null };
  private unsubscribe: (() => void) | null = null;

  componentDidMount(): void {
    if (this.props.subscribeToMore) {
      this.unsubscribe = this.subscribe();
    }
  }

  componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = () => {
    if (this.props.subscribeToMore) {
      return this.props.subscribeToMore({
        document: patientDocumentSubscriptionGraphql,
        variables: { patientId: this.props.patientId },
        updateQuery: patientDocumentsUpdateQuery,
      });
    }

    return null;
  };

  handleClosePopup = () => {
    this.setState({ modalDocumentType: null });
    this.props.closePopup();
  };

  renderPlaceholderOrDocument(type: DocumentTypeOptions) {
    const { patientDocuments, patientId } = this.props;
    const foundDocument = find(patientDocuments, document => document.documentType === type);

    return foundDocument ? (
      <PatientDocument patientDocument={foundDocument} key={`document-${foundDocument.id}`} />
    ) : (
      <DocumentPlaceholder patientId={patientId} documentType={type} key={`placeholder-${type}`} />
    );
  }

  renderRequiredDocuments() {
    const { hasMolst, hasHealthcareProxy } = this.props;
    const consentsHtml = CONSENTS.map(consentType => this.renderPlaceholderOrDocument(consentType));

    const hcpHtml = hasHealthcareProxy
      ? this.renderPlaceholderOrDocument(DocumentTypeOptions.hcp)
      : null;
    const molstHtml = hasMolst ? this.renderPlaceholderOrDocument(DocumentTypeOptions.molst) : null;

    return (
      <React.Fragment>
        {consentsHtml}
        {hcpHtml}
        {molstHtml}
      </React.Fragment>
    );
  }

  renderOtherDocuments() {
    const { patientDocuments } = this.props;

    return patientDocuments
      ? patientDocuments.map(patientDocument => {
          return patientDocument.documentType &&
            !CONSENTS.includes(patientDocument.documentType) ? (
            <PatientDocument
              patientDocument={patientDocument}
              key={`document-${patientDocument.id}`}
            />
          ) : null;
        })
      : null;
  }

  render() {
    const { patientId, isModalVisible } = this.props;
    const { modalDocumentType } = this.state;

    return (
      <div className={styles.container}>
        <LoadableDocumentsModal
          closePopup={this.handleClosePopup}
          isVisible={!!modalDocumentType || isModalVisible}
          patientId={patientId}
          preferredDocumentType={modalDocumentType || undefined}
        />
        {this.renderRequiredDocuments()}
        {this.renderOtherDocuments()}
      </div>
    );
  }
}

export default graphql(patientDocumentsGraphql, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientDocuments: data ? (data as any).patientDocuments : null,
    subscribeToMore: data ? data.subscribeToMore : null,
  }),
})(PatientDocuments);
