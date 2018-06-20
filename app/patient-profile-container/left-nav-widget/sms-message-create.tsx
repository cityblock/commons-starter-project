import React from 'react';
import { graphql } from 'react-apollo';
import smsMessageCreateGraphql from '../../graphql/queries/sms-message-create-mutation.graphql';
import { getPatient, smsMessageCreate, smsMessageCreateVariables } from '../../graphql/types';
import TextAreaWithButton from '../../shared/library/textarea-with-button/textarea-with-button';
import styles from './css/sms-message-create.css';
import smsMessageBlockFn from './sms-message-block';

interface IProps {
  patient: getPatient['patient'];
  isConsented: boolean;
  loading: boolean;
  error: string | null;
}

interface IGraphqlProps {
  createSmsMessage: (
    options: { variables: smsMessageCreateVariables },
  ) => {
    data: smsMessageCreate;
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

export default graphql<any>(smsMessageCreateGraphql, {
  name: 'createSmsMessage',
})(SmsMessageCreate) as React.ComponentClass<IProps>;
