import { featureFlags as defaultFeatureFlags } from '../../shared/util/test-data';
import { getHomeRoute } from '../helpers';

describe('Authentication helpers', () => {
  describe('getHomeRoute', () => {
    it('returns dashboard route if user can view all members', () => {
      const featureFlags = {
        ...defaultFeatureFlags,
        canViewAllMembers: true,
      };

      expect(getHomeRoute(featureFlags)).toBe('/dashboard/tasks');
    });

    it('returns dashboard route if user can view members on panel', () => {
      const featureFlags = {
        ...defaultFeatureFlags,
        canViewMembersOnPanel: true,
      };

      expect(getHomeRoute(featureFlags)).toBe('/dashboard/tasks');
    });

    it('returns manager route if cannot view members but manager enabled', () => {
      const featureFlags = {
        ...defaultFeatureFlags,
        canViewAllMembers: false,
        canViewMembersOnPanel: false,
        isManagerEnabled: true,
      };

      expect(getHomeRoute(featureFlags)).toBe('/manager');
    });

    it('returns builder route if cannot view members but builder enabled', () => {
      const featureFlags = {
        ...defaultFeatureFlags,
        canViewAllMembers: false,
        canViewMembersOnPanel: false,
        isManagerEnabled: false,
        isBuilderEnabled: true,
      };

      expect(getHomeRoute(featureFlags)).toBe('/builder');
    });

    it('returns root path if no permissions enabled', () => {
      const featureFlags = {
        isBuilderEnabled: false,
        isManagerEnabled: false,
        canChangeUserPermissions: false,
        canDeleteUsers: false,
        canBulkAssign: false,
        canEditCareTeam: false,
        canViewAllMembers: false,
        canEditAllMembers: false,
        canViewMembersOnPanel: false,
        canEditMembersOnPanel: false,
        canShowAllMembersInPatientPanel: false,
        canDisenrollPatient: false,
        canAutoBreakGlass: false,
      };

      expect(getHomeRoute(featureFlags)).toBe('/');
    });
  });
});
