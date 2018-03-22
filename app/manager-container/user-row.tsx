import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { FullUserFragment, Permissions, UserRole } from '../graphql/types';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import { Popup } from '../shared/popup/popup';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/user-row.css';

interface IProps extends IInjectedProps {
  user: FullUserFragment;
  deleteUser: (userEmail: string) => void;
  editUserPermissions: (permission: Permissions, userEmail: string) => void;
  editUserRole: (userRole: UserRole, userEmail: string) => void;
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
          <Button onClick={this.onCloseClick} messageId="manager.cancel" />
          <Button color="blue" onClick={this.onConfirmClick} messageId="manager.confirmDelete" />
        </div>
      </Popup>
    );
  }

  render() {
    const { user, editUserPermissions, editUserRole, featureFlags } = this.props;
    const popup = this.renderPopup();
    const onChangeUserPermissions = (event: React.ChangeEvent<HTMLSelectElement>) => {
      editUserPermissions(event.target.value as Permissions, user.email!);
    };
    const onChangeUserRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
      editUserRole(event.target.value as UserRole, user.email!);
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
              <Select value={user.userRole} onChange={onChangeUserRole} className={styles.select}>
                <Option value="physician" label="Physician" />
                <Option value="nurseCareManager" label="Nurse Care Manager" />
                <Option value="healthCoach" label="Health Coach" />
                <Option value="familyMember" label="Family Member" />
                <Option value="admin" label="Admin (NOTE: does not grant permissions!)" />
                <Option value="communityHealthPartner" label="Community Health Partner" />
                <Option value="outreachSpecialist" label="Outreach Specialist" />
                <Option value="primaryCarePhysician" label="Primary Care Physician" />
              </Select>
            )}
          </div>
          <div className={styles.dateSection}>
            {featureFlags.canChangeUserPermissions && (
              <Select
                value={user.permissions}
                onChange={onChangeUserPermissions}
                className={styles.select}
              >
                <Option value="green" label="Green" />
                <Option value="pink" label="Pink" />
                <Option value="orange" label="Orange" />
                <Option value="blue" label="Blue" />
                <Option value="yellow" label="Yellow" />
                <Option value="red" label="Red" />
                <Option value="black" label="Black" />
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
