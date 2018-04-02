import { find } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientDocumentsQuery from '../../../graphql/queries/get-patient-documents.graphql';
import { getPatientDocumentsQuery, DocumentTypeOptions } from '../../../graphql/types';
import RequiredPlaceholder from '../../required-placeholder';
import * as styles from './css/patient-documents.css';
import PatientDocument from './patient-document';
import PatientDocumentModal from './patient-document-modal';

const CONSENTS = [
  DocumentTypeOptions.cityblockConsent,
  DocumentTypeOptions.hipaaConsent,
  DocumentTypeOptions.hieHealthixConsent,
];

interface IProps {
  patientId: string;
  hasMolst?: boolean | null;
  hasHealthcareProxy?: boolean | null;
  closePopup: () => void;
  isModalVisible: boolean;
}

interface IGraphqlProps {
  patientDocuments?: getPatientDocumentsQuery['patientDocuments'];
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  modalDocumentType?: DocumentTypeOptions | null;
}

class PatientDocuments extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {};
  }

  handleClosePopup = () => {
    this.setState({ modalDocumentType: null });
    this.props.closePopup();
  };

  renderPlaceholderOrDocument(type: DocumentTypeOptions) {
    const { patientDocuments } = this.props;
    const foundDocument = find(patientDocuments, document => document.documentType === type);

    return foundDocument ? (
      <PatientDocument patientDocument={foundDocument} key={`document-${foundDocument.id}`} />
    ) : (
      <RequiredPlaceholder
        headerMessageId={`patientDocument.${type}`}
        onClick={() => this.setState({ modalDocumentType: type })}
        key={`placeholder-${type}`}
      />
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
          return !patientDocument.documentType ? (
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
        <PatientDocumentModal
          closePopup={this.handleClosePopup}
          isVisible={!!modalDocumentType || isModalVisible}
          patientId={patientId}
          preferredDocumentType={modalDocumentType}
        />
        {this.renderRequiredDocuments()}
        {this.renderOtherDocuments()}
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientDocumentsQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientDocuments: data ? (data as any).patientDocuments : null,
  }),
})(PatientDocuments);