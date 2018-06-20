import HelloSign from 'hellosign-embedded';
import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { DocumentTypeOptions, IRootMutationType } from 'schema';
import helloSignCreateMutationGraphql from '../../../graphql/queries/hello-sign-create.graphql';
import Text from '../../../shared/library/text/text';
import * as styles from './css/document-placeholder.css';

interface IResponse {
  data: {
    helloSignCreate: IRootMutationType['helloSignCreate'];
  };
  errors?: Array<{ message: string }>;
}

interface IMessage {
  event: string;
  signature_id: string;
}

interface IProps {
  patientId: string;
  documentType: DocumentTypeOptions;
}

interface IState {
  loading: boolean;
  error: string | null;
}

class DocumentPlaceholder extends React.Component<IProps, IState> {
  state: IState = {
    loading: false,
    error: null,
  };

  signDocument = (mutation: MutationFn) => {
    const { patientId, documentType } = this.props;

    return async () => {
      this.setState({ loading: true, error: null });

      try {
        const res = (await mutation({
          variables: { patientId, documentType },
        })) as IResponse;

        if (res.data && res.data.helloSignCreate.url) {
          // use test mode if not in production
          const testMode = process.env.NODE_ENV !== 'production';

          (HelloSign as any).init(process.env.HELLOSIGN_CLIENT_ID || '');

          (HelloSign as any).open({
            url: res.data.helloSignCreate.url,
            allowCancel: true,
            debug: testMode,
            skipDomainVerification: testMode,
            messageListener: this.uploadDocument,
          });
        } else {
          this.setState({
            loading: false,
            error: res.errors ? res.errors[0].message : 'Something went wrong :(',
          });
        }
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    };
  };

  uploadDocument = async (message: IMessage) => {
    // TODO: upload document to GCS
    if (message.event === 'signature_request_signed') {
      this.setState({ loading: false, error: null });
    }
  };

  render(): JSX.Element {
    const { documentType } = this.props;
    const { loading } = this.state;
    const messageId = loading ? 'patientDocument.loading' : `patientDocument.${documentType}`;

    return (
      <Mutation mutation={helloSignCreateMutationGraphql}>
        {mutation => (
          <div onClick={this.signDocument(mutation)} className={styles.container}>
            <Text messageId={messageId} color="red" size="medium" isBold font="basetica" />
          </div>
        )}
      </Mutation>
    );
  }
}

export default DocumentPlaceholder;
