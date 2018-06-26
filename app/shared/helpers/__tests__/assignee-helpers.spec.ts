import { UserRole } from 'schema';
import { getAssigneeInfo } from '../assignee-helpers';

describe('Assignee Helpers', () => {
  describe('getAssigneeInfo', () => {
    const firstName = 'Eevee';
    const lastName = 'Pokemon';
    const userRole = 'Pharmacist' as UserRole;

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

    it('returns default information if no assignee', () => {
      const assigneeInfo = getAssigneeInfo(null as any);

      expect(assigneeInfo.name).toBe('No Assignee');
      expect(assigneeInfo.role).toBe('Unknown Role');
    });
  });
});
