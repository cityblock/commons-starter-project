import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as userMutation from '../graphql/queries/current-user-edit-mutation.graphql';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { currentUserEditMutationVariables, FullUserFragment } from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import * as formStyles from '../shared/library/form/css/form.css';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import * as styles from './css/settings.css';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  updateUser: (options: { variables: currentUserEditMutationVariables }) => any;
  currentUser?: FullUserFragment;
  loading: boolean;
  error: string | null;
}

interface IState {
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

class SettingsContainer extends React.Component<allProps, IState> {
  state = {
    error: null,
  };

  updateUserLocale = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { currentUser } = this.props;

    if (currentUser) {
      const locale = event.target.value;

      this.props.updateUser({
        variables: {
          locale,
        },
      });
    }
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState({ [name as any]: value || '' } as any);
  };

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
            <div className={formStyles.fieldRow}>
              <div className={formStyles.field}>
                <FormLabel htmlFor="local" messageId="settings.locale" />
                <Select required name="locale" value={locale} onChange={this.updateUserLocale}>
                  <Option value="" disabled label="Select Locale" />
                  <Option value="en" label="English" />
                  <Option value="es" label="Spanish" />
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(currentUserQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
  graphql(userMutation as any, { name: 'updateUser' }),
)(SettingsContainer) as React.ComponentClass<IProps>;
