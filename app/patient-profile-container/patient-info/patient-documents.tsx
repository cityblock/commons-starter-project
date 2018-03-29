import axios from 'axios';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientDocumentSignedUrlCreate from '../../graphql/queries/patient-document-signed-url-create.graphql';
import {
  patientDocumentSignedUrlCreateMutation,
  patientDocumentSignedUrlCreateMutationVariables,
  PatientSignedUrlAction,
} from '../../graphql/types';
import * as styles from './css/patient-documents.css';

interface IProps {
  patientId: string;
  hasMolst?: boolean | null;
  hasHealthcareProxy?: boolean | null;
}

interface IGraphqlProps {
  getSignedUploadUrl: (
    options: { variables: patientDocumentSignedUrlCreateMutationVariables },
  ) => { data: patientDocumentSignedUrlCreateMutation };
}

type allProps = IProps & IGraphqlProps;

class PatientDocuments extends React.Component<allProps> {
  handleSave = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { getSignedUploadUrl, patientId } = this.props;

    const fileData = event.target.files && event.target.files[0];

    if (!fileData) return;
    const filename = fileData.name;

    const signedUrlData = await getSignedUploadUrl({
      variables: { patientId, filename, action: 'write' as PatientSignedUrlAction },
    });

    await axios.put(signedUrlData.data.patientDocumentSignedUrlCreate.signedUrl, fileData, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  };

  render() {
    return (
      <div className={styles.container}>
        Documents
        <input
          type="file"
          name="pic"
          accept=".jpg, .jpeg, .png, .doc, .docx, .txt, .pdf"
          onChange={this.handleSave}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientDocumentSignedUrlCreate as any, {
  name: 'getSignedUploadUrl',
})(PatientDocuments);
