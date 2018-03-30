import axios from 'axios';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
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

    const signedUrlData = await getSignedUploadUrl({
      variables: { patientId, filename, action: 'write' as PatientSignedUrlAction },
    });

    await axios.put(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl, selectedFile, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    await createPatientDocument({ variables: { patientId, filename } });
  };

  handleClose = () => {
    this.setState({ selectedFile: null });
    this.props.closePopup();
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      this.setState({ selectedFile });
    }
  };

  render(): JSX.Element {
    const { isVisible } = this.props;
    const { selectedFile } = this.state;
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
