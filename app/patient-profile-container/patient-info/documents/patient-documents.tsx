import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientDocumentsQuery from '../../../graphql/queries/get-patient-documents.graphql';
import { getPatientDocumentsQuery } from '../../../graphql/types';
import * as styles from './css/patient-documents.css';
import PatientDocument from './patient-document';
import PatientDocumentModal from './patient-document-modal';

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

class PatientDocuments extends React.Component<allProps> {
  render() {
    const { patientId, closePopup, isModalVisible, patientDocuments } = this.props;
    const patientDocumentsHtml = patientDocuments
      ? patientDocuments.map(patientDocument => {
          return (
            <PatientDocument
              patientDocument={patientDocument}
              key={`document-${patientDocument.id}`}
            />
          );
        })
      : null;

    return (
      <div className={styles.container}>
        <PatientDocumentModal
          closePopup={closePopup}
          isVisible={isModalVisible}
          patientId={patientId}
        />
        {patientDocumentsHtml}
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
