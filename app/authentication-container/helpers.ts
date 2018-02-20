import { PermissionsMapping } from '../../shared/permissions/permissions-mapping';

export const getHomeRoute = (featureFlags: PermissionsMapping) => {
  if (featureFlags.canViewAllMembers || featureFlags.canViewMembersOnPanel) {
    return '/dashboard/tasks';
  }

  if (featureFlags.isManagerEnabled) {
    return '/manager';
  }

  if (featureFlags.isBuilderEnabled) {
    return '/builder';
  }

  return '/';
};
