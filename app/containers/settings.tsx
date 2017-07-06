import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as styles from '../css/components/settings.css';
import * as formStyles from '../css/shared/forms.css';
import * as userMutation from '../graphql/queries/current-user-edit-mutation.graphql';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { CurrentUserEditMutationVariables, FullUserFragment } from '../graphql/types';

export interface IProps {
  updateUser: (options: { variables: CurrentUserEditMutationVariables }) => any;
  currentUser?: FullUserFragment;
  loading: boolean;
  error?: string;
}

class SettingsContainer extends React.Component<IProps, { error?: string }> {

  constructor(props: IProps) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      error: undefined,
    };
  }

  updateUser(event: React.ChangeEvent<HTMLSelectElement>) {
    const { currentUser } = this.props;
    if (currentUser) {
      const locale = event.target.value;
      this.props.updateUser({
        variables: {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          locale,
        },
      });
    }
  }

  componentDidMount() {
    document.title = 'Settings | Commons';
  }

  render() {
    const { error } = this.state;
    const { currentUser } = this.props;
    let errorHtml = null;
    if (error) {
      errorHtml = (<div className={styles.error}>{error}</div>);
    }
    const locale = currentUser && currentUser.locale ? currentUser.locale : 'en';
    return (
      <div className={styles.container}>
        {errorHtml}
        <div className={styles.background}>
          <FormattedMessage id='settings.heading'>
            {(message: string) => <div className={styles.heading}>{message}</div>}
          </FormattedMessage>
          <div className={styles.form}>
            <div className={formStyles.multiInputFormRow}>
              <div className={formStyles.inputGroup}>
                <div className={formStyles.inputLabel}>
                  Locale
                </div>
                <select required
                  name='locale'
                  value={locale}
                  onChange={this.updateUser}
                  className={formStyles.select}>
                  <option value='' disabled hidden>Select Locale</option>
                  <option value='en'>English</option>
                  <option value='es'>Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (compose)(
  graphql(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      currentUser: (data ? (data as any).currentUser : null),
    }),
  }),
  graphql(userMutation as any, { name: 'updateUser' }),
)(SettingsContainer);
