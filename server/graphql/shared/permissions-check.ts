import { Transaction } from 'objection';
import {
  businessTogglesWithoutCareTeamCheck,
  businessTogglesWithCareTeamCheck,
} from '../../../shared/permissions/business-toggles';
import {
  permissionsMappings,
  Permissions,
  PermissionsMapping,
} from '../../../shared/permissions/permissions-mapping';
import CareTeam from '../../models/care-team';
import accessControls, { Action, Resource } from './access-controls';
import resourceToModelMapping, { ResourceWithPatientIdMethod } from './resource-to-model-mapping';
import { checkUserLoggedIn } from './utils';

const checkUserPermissions = async (
  userId: string | undefined,
  permissions: Permissions,
  action: Action,
  resource: Resource,
  txn: Transaction,
  resourceId?: string,
): Promise<boolean> => {
  checkUserLoggedIn(userId);
  checkUserPermissionsExists(permissions);

  const isAllowedWithoutCareTeamCheck = await isAllowedForPermissions(
    permissions,
    action,
    resource,
    false,
  );
  if (isAllowedWithoutCareTeamCheck) return true;

  const isAllowedWithCareTeamCheck = await isAllowedForPermissions(
    permissions,
    action,
    resource,
    true,
  );
  if (!isAllowedWithCareTeamCheck || !resourceId) {
    throw new Error(`${permissions} not able to ${action} ${resource}`);
  }

  const isPassingCareTeamCheck = await isUserOnPatientCareTeam(
    userId as string,
    resource,
    resourceId,
    txn,
  );
  if (isPassingCareTeamCheck) return true;

  throw new Error(`${permissions} not able to ${action} ${resource}`);
};

const checkUserPermissionsExists = (permissions: Permissions) => {
  if (!permissions) {
    throw new Error('No user permissions level provided');
  }
};

export const getBusinessToggles = (permissions: Permissions): PermissionsMapping => {
  return permissionsMappings[permissions];
};

export const isAllowedForPermissions = async (
  permissions: Permissions,
  action: Action,
  resource: Resource,
  checkCareTeam: boolean,
): Promise<boolean> => {
  const businessToggles = getBusinessToggles(permissions);
  const togglesToFilterFrom = checkCareTeam
    ? businessTogglesWithCareTeamCheck
    : businessTogglesWithoutCareTeamCheck;
  const userToggles = togglesToFilterFrom.filter(toggle => businessToggles[toggle]);

  return accessControls.isAllowedForToggles(userToggles, action, resource);
};

export const isUserOnPatientCareTeam = async (
  userId: string,
  resource: Resource,
  resourceId: string,
  txn: Transaction,
): Promise<boolean> => {
  const model = resourceToModelMapping[resource as ResourceWithPatientIdMethod];
  if (!model) return false;
  let isOnCareTeam = false;

  // call the getPatientIdForResource on the relevant model to get patient id
  const patientId = await (model as any).getPatientIdForResource(resourceId, txn);
  // check that relevant patient is on user's care team
  const careTeamQueryResult = patientId
    ? await CareTeam.isOnCareTeam({ userId, patientId }, txn)
    : false;
  if (careTeamQueryResult) isOnCareTeam = true;

  return isOnCareTeam;
};

export default checkUserPermissions;
