import axios from 'axios';
import { lookup } from 'mime-types';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as uuid from 'uuid/v4';
import * as patientDocumentCreateMutationGraphql from '../../../graphql/queries/patient-document-create-mutation.graphql';
import * as patientDocumentSignedUrlCreate from '../../../graphql/queries/patient-document-signed-url-create.graphql';
import {
  patientDocumentCreateMutation,
  patientDocumentCreateMutationVariables,
  patientDocumentSignedUrlCreateMutation,
  patientDocumentSignedUrlCreateMutationVariables,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import FileInput from '../../../shared/library/file-input/file-input';
import Modal from '../../../shared/library/modal/modal';

const MAX_FILE_SIZE = 5 * 1048576;

interface IProps {
  isVisible: boolean;
  patientId: string;
  closePopup: () => void;
}

interface IGraphqlProps {
  getSignedUploadUrl: (
    options: { variables: patientDocumentSignedUrlCreateMutationVariables },
  ) => { data: patientDocumentSignedUrlCreateMutation };
  createPatientDocument: (
    options: { variables: patientDocumentCreateMutationVariables },
  ) => { data: patientDocumentCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  selectedFile?: File | null;
  hasFileError?: boolean;
}

export class PatientDocumentModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {};
  }

  handleSave = async (): Promise<void> => {
    const { getSignedUploadUrl, patientId, createPatientDocument } = this.props;
    const { selectedFile } = this.state;

    if (!selectedFile) return;
    const filename = selectedFile.name;

    const id = uuid();
    const contentType = lookup(filename) || 'application/octet-stream';
    const signedUrlData = await getSignedUploadUrl({
      variables: {
        patientId,
        documentId: id,
        action: 'write' as PatientSignedUrlAction,
        contentType,
      },
    });

    await axios.put(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl, selectedFile, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `filename="${filename}"`,
      },
    });

    await createPatientDocument({ variables: { id, patientId, filename } });
  };

  handleClose = () => {
    this.setState({ selectedFile: null });
    this.props.closePopup();
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        this.setState({ hasFileError: true });
        return;
      }

      this.setState({ selectedFile });
    }
  };

  render(): JSX.Element {
    const { isVisible } = this.props;
    const { selectedFile, hasFileError } = this.state;
    const filename = selectedFile ? selectedFile.name : '';

    return (
      <Modal
        isVisible={isVisible}
        onClose={this.handleClose}
        onSubmit={this.handleSave}
        titleMessageId="patientDocumentModal.title"
        subTitleMessageId="patientDocumentModal.subtitle"
        submitMessageId="patientDocumentModal.submit"
        cancelMessageId="patientDocumentModal.cancel"
      >
        <FileInput
          value={filename}
          onChange={this.handleFileChange}
          placeholderMessageId="patientDocumentModal.fileUploadPlaceholder"
          acceptTypes=".jpg, .jpeg, .png, .doc, .docx, .txt, .pdf"
          hasMaxSizeError={hasFileError}
        />
      </Modal>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientDocumentSignedUrlCreate as any, {
    name: 'getSignedUploadUrl',
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientDocumentCreateMutationGraphql as any, {
    name: 'createPatientDocument',
    options: {
      refetchQueries: ['getPatientDocuments'],
    },
  }),
)(PatientDocumentModal);
