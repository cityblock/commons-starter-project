import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as userMutation from '../graphql/queries/current-user-edit-mutation.graphql';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { currentUserEditMutationVariables, FullUserFragment } from '../graphql/types';
import Button from '../shared/library/button/button';
import FormLabel from '../shared/library/form-label/form-label';
import * as formStyles from '../shared/library/form/css/form.css';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
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
  editedPhone: string;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

class SettingsContainer extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.updateUserLocale = this.updateUserLocale.bind(this);
    this.updateUserPhone = this.updateUserPhone.bind(this);
    this.onChange = this.onChange.bind(this);

    const phone = props.currentUser && props.currentUser.phone;
    this.state = {
      editedPhone: phone || '',
      error: null,
    };
  }

  updateUserLocale = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { currentUser } = this.props;

    if (currentUser) {
      const { phone, firstName, lastName } = currentUser;
      const locale = event.target.value;

      this.props.updateUser({
        variables: {
          firstName: firstName || '',
          lastName: lastName || '',
          locale,
          phone,
        },
      });
    }
  };

  updateUserPhone = () => {
    const { currentUser } = this.props;

    if (currentUser) {
      const { phone, locale, firstName, lastName } = currentUser;
      const { editedPhone } = this.state;

      this.props.updateUser({
        variables: {
          firstName: firstName || '',
          lastName: lastName || '',
          locale,
          phone: editedPhone || phone,
        },
      });
    }
  };

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState({ [name as any]: value || '' });
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { currentUser } = nextProps;

    if (currentUser && currentUser.phone) {
      this.setState({
        editedPhone: currentUser.phone,
      });
    }
  }

  componentDidMount() {
    document.title = 'Settings | Commons';
  }

  render() {
    const { error, editedPhone } = this.state;
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
            <div className={formStyles.fieldRow}>
              <div className={formStyles.field}>
                <FormLabel htmlFor="local" messageId="settings.phone" />
                <TextInput
                  name="editedPhone"
                  value={editedPhone}
                  placeholderMessageId="settings.enterPhone"
                  onChange={this.onChange}
                />
              </div>
            </div>
            <Button
              messageId="settings.save"
              onClick={this.updateUserPhone}
              className={styles.saveButton}
            />
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
