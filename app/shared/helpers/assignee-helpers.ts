import { ShortUserFragment } from '../../graphql/types';
import { formatFullName } from './format-helpers';

interface IAssigneeInfo {
  avatar?: string | null;
  name: string;
  role: string;
}

export const getAssigneeInfo = (assignee: ShortUserFragment | null): IAssigneeInfo => {
  if (assignee) {
    return {
      avatar: assignee.googleProfileImageUrl,
      name: formatFullName(assignee.firstName || '', assignee.lastName || ''),
      role: assignee.userRole || 'Unknown Role',
    };
  } else {
    return {
      avatar: null,
      name: 'No Assignee',
      role: 'Unknown Role',
    };
  }
};
