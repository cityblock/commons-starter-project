import { ModelClass, Transaction } from 'objection';
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
import ProgressNote from '../../models/progress-note';
import accessControls, { Action, Resource } from './access-controls';
import resourceToModelMapping, {
  glassBreakResources,
  ModelResource,
} from './resource-to-model-mapping';
import { checkUserLoggedIn } from './utils';

const checkUserPermissions = async (
  userId: string | undefined,
  permissions: Permissions,
  action: Action,
  resource: Resource,
  txn: Transaction,
  resourceId?: string,
): Promise<boolean> => {
  checkLoggedInWithPermissions(userId, permissions);

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
  if (!isAllowedWithCareTeamCheck) {
    throw new Error(`${permissions} not able to ${action} ${resource}`);
  }

  const isPassingCareTeamCheck = await isUserOnPatientCareTeam(
    userId as string,
    resource,
    resourceId || null,
    txn,
  );
  if (isPassingCareTeamCheck) return true;

  throw new Error(`${permissions} not able to ${action} ${resource}`);
};

export const checkLoggedInWithPermissions = (
  userId: string | undefined,
  permissions: Permissions,
): boolean => {
  checkUserLoggedIn(userId);
  checkUserPermissionsExists(permissions);

  return true;
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
  resourceId: string | null,
  txn: Transaction,
): Promise<boolean> => {
  const model = resourceToModelMapping[resource as ModelResource] as any;
  const customResoruce = /^all[a-zA-Z]+/.test(resource) || resource.includes('Bulk');
  // deny action if model does not map to resource and it's not a custom resource
  if (!model && !customResoruce) return false;
  // if model does not have association with an individual patient, allow action
  if (customResoruce || !model.hasPHI) return true;
  // if resource id needed but not provided, do not allow action
  if (!resourceId) return false;

  // call getPatientIdForResource on the relevant model to get patient id
  const patientId = await model.getPatientIdForResource(resourceId, txn);
  // check that relevant patient is on user's care team
  const isOnCareTeam = patientId ? await CareTeam.isOnCareTeam({ userId, patientId }, txn) : false;

  return isOnCareTeam;
};

export const getGlassBreakModel = (resource: Resource): ModelClass<any> => {
  const glassBreakResource = `${resource}GlassBreak` as ModelResource;
  const isValid = glassBreakResources.includes(glassBreakResource);

  if (!isValid) {
    throw new Error('Resource does not have required glass break methods or not mapped properly');
  }

  return resourceToModelMapping[glassBreakResource];
};

export const validateGlassBreak = async (
  userId: string,
  permissions: Permissions,
  resource: Resource,
  resourceId: string,
  txn: Transaction,
  glassBreakId: string | null,
): Promise<boolean> => {
  const model = getGlassBreakModel(resource) as any;
  const businessToggles = getBusinessToggles(permissions);
  // if glass break id provided, validate it
  if (glassBreakId) {
    await model.validateGlassBreak(glassBreakId, userId, resourceId, txn);
    // if user can auto break glass, simply record their viewing of the resource
  } else if (businessToggles.canAutoBreakGlass) {
    await model.create(
      {
        userId,
        [`${resource}Id`]: resourceId,
        reason: 'Can auto break glass',
      },
      txn,
    );
    // otherwise check if glass break not required (such as if user on patient's care team)
  } else {
    const isGlassBreakNotNeeded = await validateGlassBreakNotNeeded(
      userId,
      resource,
      resourceId,
      txn,
    );

    if (!isGlassBreakNotNeeded) {
      throw new Error(
        `User ${userId} cannot automatically break the glass for ${resource} ${resourceId}`,
      );
    }
  }

  return true;
};

export const validateGlassBreakNotNeeded = async (
  userId: string,
  resource: Resource,
  resourceId: string,
  txn: Transaction,
): Promise<boolean> => {
  if (resource === 'patient') {
    return CareTeam.isOnCareTeam({ userId, patientId: resourceId }, txn);
  }
  if (resource === 'progressNote') {
    const progressNote = await ProgressNote.getForGlassBreak(resourceId, txn);
    // if template does not require a glass break action is valid
    if (
      progressNote.progressNoteTemplate &&
      !progressNote.progressNoteTemplate.requiresGlassBreak
    ) {
      return true;
    }
    // action is valid also if current user is the author of the note
    if (progressNote.userId === userId) {
      return true;
    }
  }

  return false;
};

export default checkUserPermissions;
