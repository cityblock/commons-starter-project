import axios from 'axios';
import { format } from 'date-fns';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientDocumentDeleteMutationGraphql from '../../../graphql/queries/patient-document-delete-mutation.graphql';
import * as patientDocumentSignedUrlCreate from '../../../graphql/queries/patient-document-signed-url-create.graphql';
import {
  patientDocumentDeleteMutation,
  patientDocumentDeleteMutationVariables,
  patientDocumentSignedUrlCreateMutation,
  patientDocumentSignedUrlCreateMutationVariables,
  FullPatientDocumentFragment,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import DefaultText from '../../../shared/library/default-text/default-text';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../shared/library/small-text/small-text';
import TextInfo from '../../../shared/library/text-info/text-info';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
import * as styles from './css/patient-document.css';

interface IProps extends IInjectedErrorProps {
  patientDocument: FullPatientDocumentFragment;
}

interface IGraphqlProps {
  getSignedDocumentUrl: (
    options: { variables: patientDocumentSignedUrlCreateMutationVariables },
  ) => { data: patientDocumentSignedUrlCreateMutation };
  deletePatientDocument: (
    options: { variables: patientDocumentDeleteMutationVariables },
  ) => { data: patientDocumentDeleteMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  isMenuVisible: boolean;
}

export class PatientDocument extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { isMenuVisible: false };
  }

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
        <SmallText text={description || ''} size="medium" color="gray" className={styles.right} />
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
  graphql<IGraphqlProps, IProps, allProps>(patientDocumentSignedUrlCreate as any, {
    name: 'getSignedDocumentUrl',
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientDocumentDeleteMutationGraphql as any, {
    name: 'deletePatientDocument',
    options: {
      refetchQueries: ['getPatientDocuments'],
    },
  }),
)(PatientDocument);
