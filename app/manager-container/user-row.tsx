import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { FullUserFragment, Permissions } from '../graphql/types';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import { Popup } from '../shared/popup/popup';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/user-row.css';

interface IProps extends IInjectedProps {
  user: FullUserFragment;
  deleteUser: (userEmail: string) => void;
  editUserPermissions: (permissions: Permissions, userEmail: string) => void;
}

interface IState {
  popupVisible: boolean;
}

export class UserRow extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
    this.onConfirmClick = this.onConfirmClick.bind(this);

    this.state = {
      popupVisible: false,
    };
  }

  formatUser() {
    const { user } = this.props;
    return `${user.firstName || ''} ${user.lastName || ''} (${user.email})`;
  }

  onCloseClick() {
    this.setState({ popupVisible: false });
  }

  onOpenClick() {
    this.setState({ popupVisible: true });
  }

  onConfirmClick() {
    const { user } = this.props;
    if (user.email) {
      this.props.deleteUser(user.email);
      this.setState({ popupVisible: true });
    }
  }

  renderPopup() {
    const { popupVisible } = this.state;
    return (
      <Popup visible={popupVisible}>
        <div className={styles.popupHeading}>
          Are you sure you want to delete {this.formatUser()}?
        </div>
        <div className={styles.buttons}>
          <div className={styles.buttonInverted} onClick={this.onCloseClick}>
            Close
          </div>
          <div className={styles.button} onClick={this.onConfirmClick}>
            Confirm Delete
          </div>
        </div>
      </Popup>
    );
  }

  render() {
    const { user, editUserPermissions, featureFlags } = this.props;
    const popup = this.renderPopup();
    const onChangeUserPermissions = (event: React.ChangeEvent<HTMLSelectElement>) => {
      editUserPermissions(event.target.value as Permissions, user.email!);
    };
    const formattedCreatedAt = (
      <FormattedRelative value={user.createdAt}>
        {(date: string) => <span className={styles.dateValue}>{date}</span>}
      </FormattedRelative>
    );
    const formattedUpdatedAt = (
      <FormattedDate value={user.updatedAt} year="numeric" month="short" day="numeric">
        {(date: string) => <span className={styles.dateValue}>{date}</span>}
      </FormattedDate>
    );
    return (
      <div className={styles.container}>
        <div className={styles.title}>{this.formatUser()}</div>
        <div className={styles.meta}>
          <div className={styles.dateSection}>
            {featureFlags.canChangeUserPermissions && (
              <Select
                value={user.permissions}
                onChange={onChangeUserPermissions}
                className={styles.select}
              >
                <Option value="green">Green</Option>
                <Option value="pink">pink</Option>
                <Option value="orange">Orange</Option>
                <Option value="blue">Blue</Option>
                <Option value="yellow">Yellow</Option>
                <Option value="red">Red</Option>
                <Option value="black">Black</Option>
              </Select>
            )}
          </div>
          <div className={styles.dateSection}>
            <FormattedMessage id="user.createdAt">
              {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
            </FormattedMessage>
            {formattedCreatedAt}
          </div>
          <div className={styles.dateSection}>
            <FormattedMessage id="user.editedAt">
              {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
            </FormattedMessage>
            {formattedUpdatedAt}
          </div>
          {featureFlags.canDeleteUsers && (
            <div className={styles.userDel}>
              <Button messageId="user.delete" onClick={this.onOpenClick} />
            </div>
          )}
          {popup}
        </div>
      </div>
    );
  }
}

export default withCurrentUser()(UserRow);
