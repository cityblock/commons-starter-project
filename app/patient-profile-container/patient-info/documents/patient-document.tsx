import { format } from 'date-fns';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientDocumentSignedUrlCreate from '../../../graphql/queries/patient-document-signed-url-create.graphql';
import {
  patientDocumentSignedUrlCreateMutation,
  patientDocumentSignedUrlCreateMutationVariables,
  FullPatientDocumentFragment,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../shared/library/small-text/small-text';
import TextInfo from '../../../shared/library/text-info/text-info';
import * as styles from './css/patient-document.css';

interface IProps {
  patientDocument: FullPatientDocumentFragment;
}

interface IGraphqlProps {
  getSignedDocumentUrl: (
    options: { variables: patientDocumentSignedUrlCreateMutationVariables },
  ) => { data: patientDocumentSignedUrlCreateMutation };
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

  handleDeleteClick = () => {
    // TODO
  };

  handleDownloadClick = async () => {
    const { getSignedDocumentUrl, patientDocument } = this.props;
    const { id, patientId } = patientDocument;

    try {
      const signedUrlData = await getSignedDocumentUrl({
        variables: { patientId, documentId: id, action: 'read' as PatientSignedUrlAction },
      });

      window.open(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl, '_blank');
    } catch (err) {
      // TODO: do something with error
    }
  };

  render() {
    const { isMenuVisible } = this.state;
    const { filename, description, createdAt, uploadedBy } = this.props.patientDocument;
    const userName = formatFullName(uploadedBy.firstName, uploadedBy.lastName);

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>{filename}</div>
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

export default graphql<IGraphqlProps, IProps, allProps>(patientDocumentSignedUrlCreate as any, {
  name: 'getSignedDocumentUrl',
})(PatientDocument);
