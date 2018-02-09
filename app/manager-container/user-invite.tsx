import * as React from 'react';
import * as styles from '../shared/css/create-form.css';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';

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

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.state = {
      loading: false,
      error: null,
      localEmail: null,
    };
  }

  onChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    const fieldValue = event.target.value;

    this.setState({ localEmail: fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }
  render() {
    const { loading, localEmail, error } = this.state;

    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={styles.container}>
        <form onSubmit={this.onSubmit}>
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
              <input
                name="email"
                value={localEmail || ''}
                placeholder={'Enter text before @cityblock in email'}
                className={formStyles.input}
                onChange={this.onChangeEmail}
              />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Invite User" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default UserInvite;
