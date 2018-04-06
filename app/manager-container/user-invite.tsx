import * as React from 'react';
import * as styles from '../shared/css/create-form.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';

interface IProps {
  onClose: () => any;
  inviteUser: (email: string) => any;
}

interface IState {
  loading: boolean;
  error: string | null;
  localEmail: string | null;
}

class UserInvite extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      localEmail: null,
    };
  }

  onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = event.target.value;

    this.setState({ localEmail: fieldValue });
  };

  onSubmit = async () => {
    if (this.state.localEmail) {
      try {
        // only accept alphanumeric characters (ie no @cityblock.com)
        if (/^[a-zA-Z0-9.]+$/.test(this.state.localEmail)) {
          this.setState({ loading: true });
          this.props.inviteUser(this.state.localEmail);
          this.setState({ loading: false, localEmail: '' });
          this.props.onClose();
        } else {
          this.setState({ error: "Please enter only the start of an email address (ie: 'logan')" });
        }
      } catch (err) {
        this.setState({ error: err.message, loading: false });
      }
    }
    return false;
  };
  render() {
    const { loading, localEmail, error } = this.state;

    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    return (
      <div className={styles.container}>
        <div className={styles.formTop}>
          <div className={styles.smallSection}>
            <div className={styles.smallText}>Invite User</div>
          </div>
          <div className={styles.close} onClick={this.props.onClose} />
        </div>
        <div className={styles.formCenter}>
          <div className={loadingClass}>
            <div className={styles.loadingContainer}>
              <div className={loadingStyles.loadingSpinner} />
            </div>
          </div>
          <div className={styles.error}>{error}</div>
          <div className={styles.inputGroup}>
            <TextInput
              name="email"
              value={localEmail || ''}
              placeholderMessageId="manager.enterEmail"
              onChange={this.onChangeEmail}
            />
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button color="white" onClick={this.props.onClose} messageId="builder.cancel" />
            <Button onClick={this.onSubmit} label="Invite User" />
          </div>
        </div>
      </div>
    );
  }
}

export default UserInvite;
