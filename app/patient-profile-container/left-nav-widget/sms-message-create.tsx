import * as React from 'react';
import { graphql } from 'react-apollo';
import * as smsMessageCreateMutationGraphql from '../../graphql/queries/sms-message-create-mutation.graphql';
import { smsMessageCreateMutation, smsMessageCreateMutationVariables } from '../../graphql/types';
import TextAreaWithButton from '../../shared/library/textarea-with-button/textarea-with-button';
import * as styles from './css/sms-message-create.css';

interface IProps {
  patientId: string;
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
  constructor(props: allProps) {
    super(props);

    this.state = { body: '' };
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ body: e.currentTarget.value });
  };

  handleSubmit = async (): Promise<void> => {
    await this.props.createSmsMessage({
      variables: {
        patientId: this.props.patientId,
        body: this.state.body,
      },
    });

    this.setState({ body: '' });
  };

  render(): JSX.Element {
    const { body } = this.state;

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
