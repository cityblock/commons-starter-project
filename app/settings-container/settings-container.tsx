import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as userMutation from '../graphql/queries/current-user-edit-mutation.graphql';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { currentUserEditMutationVariables, FullUserFragment } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as styles from './css/settings.css';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  updateUser: (options: { variables: currentUserEditMutationVariables }) => any;
  currentUser?: FullUserFragment;
  loading: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

class SettingsContainer extends React.Component<allProps, { error?: string }> {
  constructor(props: allProps) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      error: undefined,
    };
  }

  updateUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  componentDidMount() {
    document.title = 'Settings | Commons';
  }

  render() {
    const { error } = this.state;
    const { currentUser } = this.props;
    let errorHtml = null;
    if (error) {
      errorHtml = <div>{error}</div>;
    }
    const locale = currentUser && currentUser.locale ? currentUser.locale : 'en';
    return (
      <div className={styles.container}>
        {errorHtml}
        <div className={styles.background}>
          <FormattedMessage id="settings.heading">
            {(message: string) => <div className={styles.heading}>{message}</div>}
          </FormattedMessage>
          <div className={styles.form}>
            <div className={formStyles.multiInputFormRow}>
              <div className={formStyles.inputGroup}>
                <div className={formStyles.inputLabel}>Locale</div>
                <select
                  required
                  name="locale"
                  value={locale}
                  onChange={this.updateUser}
                  className={formStyles.select}
                >
                  <option value="" disabled hidden>
                    Select Locale
                  </option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(currentUserQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(userMutation as any, { name: 'updateUser' }),
)(SettingsContainer);
