import HelloSign from 'hellosign-embedded';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { DocumentTypeOptions, IRootMutationType } from 'schema';
import helloSignCreateMutationGraphql from '../../../graphql/queries/hello-sign-create.graphql';
import helloSignTransferMutationGraphql from '../../../graphql/queries/hello-sign-transfer.graphql';
import {
  helloSignCreate,
  helloSignCreateVariables,
  helloSignTransfer,
  helloSignTransferVariables,
} from '../../../graphql/types';
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

interface IGraphqlProps {
  getHelloSignUrl: (options: { variables: helloSignCreateVariables }) => { data: helloSignCreate };
  transferHelloSign: (
    options: { variables: helloSignTransferVariables },
  ) => { data: helloSignTransfer };
}

interface IState {
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

export class DocumentPlaceholder extends React.Component<allProps, IState> {
  state: IState = {
    loading: false,
    error: null,
  };

  signDocument = async (): Promise<void> => {
    const { patientId, documentType, getHelloSignUrl } = this.props;
    this.setState({ loading: true, error: null });

    if (!this.state.loading) {
      try {
        const res = (await getHelloSignUrl({
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
            uxVersion: 2,
            messageListener: this.uploadDocument(res.data.helloSignCreate.requestId),
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
    }
  };

  uploadDocument(requestId: string) {
    return async (message: IMessage) => {
      const { patientId, documentType, transferHelloSign } = this.props;

      if (message.event === 'signature_request_signed') {
        await transferHelloSign({
          variables: {
            patientId,
            documentType,
            requestId,
          },
        });
      }
    };
  }

  render(): JSX.Element {
    const { documentType } = this.props;
    const { loading } = this.state;
    const messageId = loading ? 'patientDocument.loading' : `patientDocument.${documentType}`;

    return (
      <div onClick={this.signDocument} className={styles.container}>
        <Text messageId={messageId} color="red" size="medium" isBold font="basetica" />
      </div>
    );
  }
}

export default compose(
  graphql(helloSignCreateMutationGraphql, {
    name: 'getHelloSignUrl',
  }),
  graphql(helloSignTransferMutationGraphql, {
    name: 'transferHelloSign',
  }),
)(DocumentPlaceholder);
