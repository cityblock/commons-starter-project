//  This file was automatically generated and should not be edited.
/* tslint:disable */

export type UserRole =
  "physician" |
  "nurseCareManager" |
  "healthCoach" |
  "familyMember" |
  "anonymousUser" |
  "admin";


export interface GetCurrentUserQuery {
  // The current User
  currentUser: FullUserFragment;
}

export interface GetPatientPanelQueryVariables {
  pageNumber: number | null;
  pageSize: number | null;
}

export interface GetPatientPanelQuery {
  // List of patients the user is on the care team for (their 'patient panel')
  userPatientPanel: {
    edges: Array< {
      node: ShortPatientFragment,
    } > | null,
  } | null;
}

export interface LogInUserMutationVariables {
  googleAuthCode: string;
}

export interface LogInUserMutation {
  // Login user
  userLogin: {
    // The auth token to allow for quick login. JWT passed back in via headers for further requests
    authToken: string | null,
    user: FullUserFragment,
  } | null;
}

export interface FullUserFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
}

export interface ShortPatientFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  zip: number | null;
  createdAt: string | null;
}
/* tslint:enable */
