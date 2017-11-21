import { ShortUserFragment } from '../../graphql/types';
import { formatFullName } from './format-helpers';

interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}
export const DEFAULT_AVATAR_URL = 'https://bit.ly/2weRwJm';

export const getAssigneeInfo = (assignee?: ShortUserFragment): IAssigneeInfo => {
  if (assignee) {
    return {
      avatar: assignee.googleProfileImageUrl || DEFAULT_AVATAR_URL,
      name: formatFullName(assignee.firstName || '', assignee.lastName || ''),
      role: assignee.userRole || 'Unknown Role',
    };
  } else {
    return {
      avatar: DEFAULT_AVATAR_URL,
      name: 'No Assignee',
      role: 'Unknown Role',
    };
  }
};
