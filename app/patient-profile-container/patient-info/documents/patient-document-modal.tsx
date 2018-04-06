import axios from 'axios';
import { values } from 'lodash';
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
  DocumentTypeOptions,
  PatientSignedUrlAction,
} from '../../../graphql/types';
import FileInput from '../../../shared/library/file-input/file-input';
import FormLabel from '../../../shared/library/form-label/form-label';
import * as styles from '../../../shared/library/form/css/form.css';
import Modal from '../../../shared/library/modal/modal';
import Select from '../../../shared/library/select/select';
import Spinner from '../../../shared/library/spinner/spinner';
import TextArea from '../../../shared/library/textarea/textarea';

const MAX_FILE_SIZE = 5 * 1048576;

interface IProps {
  isVisible: boolean;
  patientId: string;
  preferredDocumentType?: DocumentTypeOptions;
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
  documentType?: DocumentTypeOptions | null;
  description?: string | null;
  isSaving?: boolean;
  error?: string | null;
}

export class PatientDocumentModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {};
  }

  handleSave = async (): Promise<void> => {
    const {
      getSignedUploadUrl,
      patientId,
      createPatientDocument,
      preferredDocumentType,
    } = this.props;
    const { selectedFile, description, documentType } = this.state;

    if (!selectedFile) return;
    const filename = selectedFile.name;

    this.setState({ isSaving: true });

    const id = uuid();
    const contentType = lookup(filename) || 'application/octet-stream';
    try {
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

      await createPatientDocument({
        variables: {
          id,
          patientId,
          filename,
          description,
          documentType: documentType || preferredDocumentType,
        },
      });

      this.setState({ isSaving: false, error: null });
      this.handleClose();
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  handleClose = () => {
    this.setState({ selectedFile: null, documentType: null, description: null, error: null });
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

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  renderForm() {
    const { selectedFile, hasFileError, documentType, description } = this.state;
    const { preferredDocumentType } = this.props;
    const filename = selectedFile ? selectedFile.name : '';

    return (
      <React.Fragment>
        <div className={styles.field}>
          <FormLabel messageId="patientDocumentModal.fileUpload" />
          <FileInput
            value={filename}
            onChange={this.handleFileChange}
            placeholderMessageId="patientDocumentModal.fileUploadPlaceholder"
            acceptTypes=".jpg, .jpeg, .png, .doc, .docx, .txt, .pdf"
            hasMaxSizeError={hasFileError}
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientDocumentModal.documentType" />
          <Select
            options={values(DocumentTypeOptions)}
            name="documentType"
            value={documentType || preferredDocumentType || ''}
            onChange={this.handleInputChange}
            large={true}
            isUnselectable={true}
            hasPlaceholder={true}
          />
        </div>

        <div className={styles.field}>
          <FormLabel messageId="patientDocumentModal.description" />
          <TextArea
            name="description"
            value={description || ''}
            onChange={this.handleInputChange}
            placeholderMessageId="patientDocumentModal.descriptionPlaceholder"
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { isSaving, error } = this.state;

    const bodyHtml = isSaving ? <Spinner className={styles.spinner} /> : this.renderForm();

    return (
      <Modal
        isVisible={isVisible}
        onClose={this.handleClose}
        onSubmit={this.handleSave}
        titleMessageId="patientDocumentModal.title"
        subTitleMessageId="patientDocumentModal.subtitle"
        submitMessageId="patientDocumentModal.submit"
        cancelMessageId="patientDocumentModal.cancel"
        isButtonHidden={isSaving}
        error={error}
      >
        {bodyHtml}
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
