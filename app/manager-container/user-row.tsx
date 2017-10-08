import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { FullUserFragment } from '../graphql/types';
import * as styles from './css/user-row.css';

interface IProps {
  user: FullUserFragment;
  deleteUser: (userEmail: string) => void;
  editUserRole: (userRole: string, userEmail: string) => void;
}

export const UserRow: React.StatelessComponent<IProps> = props => {
  const { user, deleteUser, editUserRole } = props;

  const deleteUserClick = () => {
    deleteUser(user.email!);
  };
  const onChangeUserRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editUserRole(event.target.value, user.email!);
  };
  const formattedCreatedAt = (
    <FormattedRelative value={user.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  );
  const formattedUpdatedAt = (
    <FormattedDate value={user.updatedAt} year='numeric' month='short' day='numeric'>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedDate>
  );
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {user.firstName} {user.lastName} ({user.email})
      </div>
      <div className={styles.meta}>
        <div className={styles.dateSection}>
          <select value={user.userRole} onChange={onChangeUserRole}>
            <option value='physician'>Physician</option>
            <option value='nurseCareManager'>Nurse Care Manager</option>
            <option value='healthCoach'>Health Coach</option>
            <option value='familyMember'>Family Memeber</option>
            <option value='anonymousUser'>Not yet set</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <div className={styles.dateSection}>
          <FormattedMessage id='user.createdAt'>
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedCreatedAt}
        </div>
        <div className={styles.dateSection}>
          <FormattedMessage id='user.editedAt'>
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedUpdatedAt}
        </div>
        <div className={styles.userDel}>
          <FormattedMessage id='user.delete'>
            {(message: string) => (
              <span onClick={deleteUserClick} className={styles.button}>
                {message}
              </span>
            )}
          </FormattedMessage>
        </div>
      </div>
    </div>
  );
};
