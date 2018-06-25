import axios from 'axios';
import { format } from 'date-fns';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientDocumentsGraphql from '../../../graphql/queries/get-patient-documents.graphql';
import patientDocumentDeleteGraphql from '../../../graphql/queries/patient-document-delete-mutation.graphql';
import patientDocumentSignedUrlCreateGraphql from '../../../graphql/queries/patient-document-signed-url-create.graphql';
import {
  patientDocumentDelete,
  patientDocumentDeleteVariables,
  patientDocumentSignedUrlCreate,
  patientDocumentSignedUrlCreateVariables,
  FullPatientDocument,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import DefaultText from '../../../shared/library/default-text/default-text';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import TextInfo from '../../../shared/library/text-info/text-info';
import Text from '../../../shared/library/text/text';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
import styles from './css/patient-document.css';

interface IProps {
  patientDocument: FullPatientDocument;
}

interface IGraphqlProps {
  getSignedDocumentUrl: (
    options: { variables: patientDocumentSignedUrlCreateVariables },
  ) => { data: patientDocumentSignedUrlCreate };
  deletePatientDocument: (
    options: { variables: patientDocumentDeleteVariables },
  ) => { data: patientDocumentDelete };
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

interface IState {
  isMenuVisible: boolean;
}

export class PatientDocument extends React.Component<allProps, IState> {
  state = { isMenuVisible: false };

  handleMenuToggle = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  handleDeleteClick = async () => {
    const {
      getSignedDocumentUrl,
      patientDocument,
      deletePatientDocument,
      openErrorPopup,
    } = this.props;
    const { id, patientId } = patientDocument;

    try {
      const signedUrlData = await getSignedDocumentUrl({
        variables: { patientId, documentId: id, action: 'delete' as PatientSignedUrlAction },
      });

      await axios.delete(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl);
      await deletePatientDocument({ variables: { patientDocumentId: id } });
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  handleDownloadClick = async () => {
    const { getSignedDocumentUrl, patientDocument, openErrorPopup } = this.props;
    const { id, patientId } = patientDocument;

    try {
      const signedUrlData = await getSignedDocumentUrl({
        variables: { patientId, documentId: id, action: 'read' as PatientSignedUrlAction },
      });

      window.open(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl, '_blank');
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  render() {
    const { isMenuVisible } = this.state;
    const {
      filename,
      description,
      createdAt,
      uploadedBy,
      documentType,
    } = this.props.patientDocument;
    const userName = formatFullName(uploadedBy.firstName, uploadedBy.lastName);

    const titleHtml = documentType ? (
      <DefaultText messageId={`documentType.${documentType}`} className={styles.title} />
    ) : (
      <div className={styles.title}>{filename}</div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          {titleHtml}
          <div className={styles.flexRow}>
            <TextInfo
              messageId="patientDocument.uploadedBy"
              messageColor="gray"
              text={userName}
              textColor="gray"
              size="medium"
            />
            <TextInfo
              messageId="patientDocument.uploadedOn"
              messageColor="gray"
              text={format(createdAt, 'MM/DD/YYYY')}
              textColor="gray"
              size="medium"
            />
          </div>
        </div>
        <Text text={description || ''} size="medium" color="gray" className={styles.right} />
        <HamburgerMenu
          open={isMenuVisible}
          onMenuToggle={this.handleMenuToggle}
          className={styles.menu}
        >
          <HamburgerMenuOption
            messageId="patientDocument.download"
            icon="fileDownload"
            onClick={this.handleDownloadClick}
          />
          <HamburgerMenuOption
            messageId="patientDocument.delete"
            icon="delete"
            onClick={this.handleDeleteClick}
          />
        </HamburgerMenu>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(patientDocumentSignedUrlCreateGraphql, {
    name: 'getSignedDocumentUrl',
  }),
  graphql(patientDocumentDeleteGraphql, {
    name: 'deletePatientDocument',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: patientDocumentsGraphql,
          variables: {
            patientId: props.patientDocument.patientId,
          },
        },
      ],
    }),
  }),
)(PatientDocument) as React.ComponentClass<IProps>;
