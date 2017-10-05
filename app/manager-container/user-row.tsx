import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import {
  userEditRoleMutationVariables,
  FullUserFragment,
} from '../graphql/types';
import * as styles from './css/user-row.css';

export interface IProps {
  user: FullUserFragment;
  deleteUser: (userEmail: string) => void;
  editUserRole?: (
    options: { variables: userEditRoleMutationVariables },
  ) => { data: { userEdit: FullUserFragment } };
}

export const UserRow: React.StatelessComponent<IProps> = props => {
  const { user, deleteUser } = props;

  const deleteUserClick = () => {
    deleteUser(user.email!);
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
