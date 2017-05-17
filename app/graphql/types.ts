//  This file was automatically generated and should not be edited.
/* tslint:disable */

export type UserRole =
  "physician" |
  "nurseCareManager" |
  "healthCoach" |
  "familyMember" |
  "anonymousUser";


export interface GetCurrentUserQuery {
  // The current User
  currentUser: FullUserFragment;
}

export interface LogInUserMutationVariables {
  email: string;
  password: string;
}

export interface LogInUserMutation {
  // Login user
  login: {
    // The auth token to allow for quick login. JWT passed back in via headers for further requests
    authToken: string | null,
    user: FullUserFragment,
  } | null;
}

export interface FullUserFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole | null;
  email: string | null;
}
/* tslint:enable */
