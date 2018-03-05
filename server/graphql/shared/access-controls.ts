import * as acl from 'acl';
import { BusinessToggleName } from '../../../shared/permissions/business-toggle-names';
import { UserRole } from '../../models/user';
import aclJson from './acl';

export type Action = 'view' | 'edit' | 'delete' | 'create' | 'disenroll';
export type Resource =
  | 'patient'
  | 'allPatients'
  | 'note'
  | 'patientEvents'
  | 'user'
  | 'allUsers'
  | 'encounter'
  | 'clinic'
  | 'task'
  | 'taskComment'
  | 'appointment'
  | 'answer'
  | 'questionCondition'
  | 'patientAnswer'
  | 'riskAreaGroup'
  | 'riskArea'
  | 'question'
  | 'concern'
  | 'concernSuggestion'
  | 'patientConcern'
  | 'taskTemplate'
  | 'goalSuggestionTemplate'
  | 'patientGoal'
  | 'screeningTool'
  | 'screeningToolScoreRange'
  | 'carePlanSuggestion'
  | 'careTeam'
  | 'careTeamBulk'
  | 'goalSuggestion'
  | 'patientTaskSuggestion'
  | 'taskSuggestion'
  | 'patientScreeningToolSubmission'
  | 'riskAreaAssessmentSubmission'
  | 'progressNote'
  | 'progressNoteTemplate'
  | 'quickCall'
  | 'computedField'
  | 'computedFieldFlag'
  | 'patientList'
  | 'CBOCategory'
  | 'CBO'
  | 'CBOReferral'
  | 'eventNotification'
  | 'patientGlassBreak'
  | 'progressNoteGlassBreak'
  | 'address'
  | 'phone'
  | 'email';

/*
ACL SPEC:
Role: Physician, Nurse Care Manager
Data write: all
Feature visibility: all

Role: Health Coach
Feature visibility: cannot write notes

TODO: Data read: all except substance abuse
TODO: Data write: all, except: non-home visit encounter type

Role: familyMember
Data read: see patient if they are on patient's care team
Data write: none
TODO: restrict data read to only non-clinical data for patient
*/

export const aclInstance: any = new acl(new acl.memoryBackend());
// the type for instance of acl is not exported from the typescript def so we make our own
export type Acl = typeof aclInstance;

export class AccessControls {
  constructor(private accessControls: Acl) {
    accessControls.allow(aclJson);
  }

  /**
   * Handles both role based auth (ie: checking if a Family Member can edit notes generally)
   */
  async isAllowed(userRole: UserRole, action: Action, resource: Resource) {
    if (await this.accessControls.areAnyRolesAllowed(userRole, resource, action)) {
      return true;
    } else {
      throw new Error(`${userRole} not able to ${action} ${resource}`);
    }
  }

  /**
   * Handles id basesd auth (ie: checking if a user is on a patient's care team)
   */
  async isAllowedForUser(
    userRole: UserRole,
    action: Action,
    resource: Resource,
    resourceId?: string,
    userId?: string,
  ) {
    const allowed = await this.accessControls.areAnyRolesAllowed(userRole, resource, action);

    if (allowed) {
      return true;
    } else {
      throw new Error(`${userRole} not able to ${action} ${resource}`);
    }
  }

  async isAllowedForToggles(toggles: BusinessToggleName[], action: Action, resource: Resource) {
    return this.accessControls.areAnyRolesAllowed(toggles, resource, action);
  }
}

export default new AccessControls(aclInstance);
