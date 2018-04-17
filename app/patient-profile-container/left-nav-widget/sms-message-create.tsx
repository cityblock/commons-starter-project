import * as React from 'react';
import { graphql } from 'react-apollo';
import * as smsMessageCreateMutationGraphql from '../../graphql/queries/sms-message-create-mutation.graphql';
import { smsMessageCreateMutation, smsMessageCreateMutationVariables } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import TextArea from '../../shared/library/textarea/textarea';
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
  loading: boolean;
  error: string | null;
  body: string;
}

export class SmsMessageCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { loading: false, error: null, body: '' };
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ body: e.currentTarget.value });
  };

  handleSubmit = async (): Promise<void> => {
    const { loading, body } = this.state;

    if (!loading && body) {
      try {
        this.setState({ loading: true, error: null });

        await this.props.createSmsMessage({
          variables: {
            patientId: this.props.patientId,
            body,
          },
        });

        this.setState({ loading: false, error: null, body: '' });
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
  };

  render(): JSX.Element {
    const { body, loading } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <TextArea
            value={body}
            onChange={this.handleChange}
            placeholderMessageId="messages.createPlaceholder"
            className={styles.input}
          />
          <Button
            messageId="messages.send"
            onClick={this.handleSubmit}
            color="white"
            disabled={loading}
            className={styles.button}
          />
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(smsMessageCreateMutationGraphql as any, {
  name: 'createSmsMessage',
})(SmsMessageCreate);
