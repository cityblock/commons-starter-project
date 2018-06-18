import React from 'react';
import Avatar from '../library/avatar/avatar';
import Icon from '../library/icon/icon';
import SelectDropdownOption from '../library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../library/select-dropdown/select-dropdown';
import styles from './css/care-team-multi-select.css';

export interface IUser {
  id: string;
  name: string;
  roleMessageId?: string;
  role?: string;
  email?: string | null;
  avatar?: string | null;
  isPermanent?: boolean;
}

export interface IProps {
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  users?: IUser[];
  placeholderMessageId: string;
  name?: string;
  isLoading?: boolean;
  error?: string;
}

export default class CareTeamMultiSelect extends React.Component<IProps> {
  handleAddUserClick = (user: IUser) => {
    const { onChange, selectedUsers, name } = this.props;
    onChange([...selectedUsers, user], name);
  };

  handleRemoveUserClick = (userToRemove: IUser) => {
    const { onChange, selectedUsers, name } = this.props;
    const updatedUsers = selectedUsers.filter(user => user.id !== userToRemove.id);
    onChange(updatedUsers, name);
  };

  getValidAssignees(): IUser[] {
    const { users, selectedUsers } = this.props;
    return users
      ? users.filter(member => selectedUsers.findIndex(user => member.id === user.id) < 0)
      : [];
  }

  renderCareTeamOptions(): JSX.Element[] {
    const userOptions = this.getValidAssignees();

    return userOptions.map(userOption => {
      const { avatar, name, role, roleMessageId } = userOption;

      return (
        <SelectDropdownOption
          key={userOption.id}
          onClick={() => this.handleAddUserClick(userOption)}
          avatarUrl={avatar}
          value={name}
          detail={role}
          detailMessageId={roleMessageId}
        />
      );
    });
  }

  renderSelectedUsers(): JSX.Element[] {
    const { selectedUsers } = this.props;

    return selectedUsers.map(selectedUser => {
      const { avatar, name, isPermanent } = selectedUser;

      const closeButton = !isPermanent ? (
        <Icon
          name="close"
          className={styles.remove}
          onClick={() => this.handleRemoveUserClick(selectedUser)}
        />
      ) : null;

      return (
        <div key={selectedUser.id} className={styles.user}>
          <div className={styles.info}>
            <Avatar src={avatar} size="medium" />
            <h4>{name}</h4>
          </div>
          {closeButton}
        </div>
      );
    });
  }

  render(): JSX.Element {
    const { isLoading, placeholderMessageId, error } = this.props;

    return (
      <React.Fragment>
        <SelectDropdown
          value=""
          loading={isLoading}
          error={error}
          placeholderMessageId={placeholderMessageId}
          largeFont={true}
        >
          {this.renderCareTeamOptions()}
        </SelectDropdown>
        {this.renderSelectedUsers()}
      </React.Fragment>
    );
  }
}
