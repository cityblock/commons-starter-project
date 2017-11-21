import {
  getAssigneeInfo,
  DEFAULT_AVATAR_URL,
} from '../assignee-helpers';

describe('Assignee Helpers', () => {
  describe('getAssigneeInfo', () => {
    const firstName = 'Eevee';
    const lastName = 'Pokemon';
    const userRole = 'admin';

    it('returns assignee info if assignee present', () => {
      const avatarUrl = 'eevee.png';

      const assignee = {
        googleProfileImageUrl: avatarUrl,
        firstName,
        lastName,
        userRole,
      } as any;

      const assigneeInfo = getAssigneeInfo(assignee);

      expect(assigneeInfo.avatar).toBe(avatarUrl);
      expect(assigneeInfo.name).toBe(`${firstName} ${lastName}`);
      expect(assigneeInfo.role).toBe(userRole);
    });

    it('returns default avatar url if none present', () => {
      const assignee = {
        firstName,
        lastName,
        userRole,
      } as any;

      const assigneeInfo = getAssigneeInfo(assignee);

      expect(assigneeInfo.avatar).toBe(DEFAULT_AVATAR_URL);
    });

    it('returns default information if no assignee', () => {
      const assigneeInfo = getAssigneeInfo(null as any);

      expect(assigneeInfo.avatar).toBe(DEFAULT_AVATAR_URL);
      expect(assigneeInfo.name).toBe('No Assignee');
      expect(assigneeInfo.role).toBe('Unknown Role');
    });
  });
});
