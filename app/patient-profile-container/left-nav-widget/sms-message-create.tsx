import * as React from 'react';
import { graphql } from 'react-apollo';
import * as smsMessageCreateMutationGraphql from '../../graphql/queries/sms-message-create-mutation.graphql';
import {
  getPatientQuery,
  smsMessageCreateMutation,
  smsMessageCreateMutationVariables,
} from '../../graphql/types';
import TextAreaWithButton from '../../shared/library/textarea-with-button/textarea-with-button';
import * as styles from './css/sms-message-create.css';
import smsMessageBlockFn from './sms-message-block';

interface IProps {
  patient: getPatientQuery['patient'];
  isConsented: boolean;
  loading: boolean;
  error: string | null;
}

interface IGraphqlProps {
  createSmsMessage: (
    options: { variables: smsMessageCreateMutationVariables },
  ) => {
    data: smsMessageCreateMutation;
  };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  body: string;
}

export class SmsMessageCreate extends React.Component<allProps, IState> {
  state = { body: '' };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ body: e.currentTarget.value });
  };

  handleSubmit = async (): Promise<void> => {
    await this.props.createSmsMessage({
      variables: {
        patientId: this.props.patient.id,
        body: this.state.body,
      },
    });

    this.setState({ body: '' });
  };

  render(): JSX.Element {
    const { body } = this.state;
    const { loading, error, patient, isConsented } = this.props;

    // if loading, error, not consented, or no primary phone, render block UI
    const smsMessageBlock = smsMessageBlockFn({ patient, loading, error, isConsented });

    if (smsMessageBlock) {
      return <div className={styles.container}>{smsMessageBlock}</div>;
    }

    return (
      <div className={styles.container}>
        <TextAreaWithButton
          value={body}
          onChange={this.handleChange}
          placeholderMessageId="messages.createPlaceholder"
          submitMessageId="messages.send"
          loadingMessageId="messages.sending"
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default graphql<any>(smsMessageCreateMutationGraphql as any, {
  name: 'createSmsMessage',
})(SmsMessageCreate) as React.ComponentClass<IProps>;
