declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /*
    description: 
  */
  interface IRootQueryType {
    user: IUser | null;
    currentUser: IUser | null;
  }

  /*
    description: 
  */
  interface IUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum | null;
    createdAt: any;
    slackId: string | null;
  }

  /*
    description: An object with a Globally Unique ID
  */
  type uniqueUserId = IUser;

  /*
    description: An object with a Globally Unique ID
  */
  interface IUniqueUserId {
    id: string;
  }

  /*
    description: 
  */
  type IUserRoleEnum = 'physician' | 'nurseCareManager' | 'healthCoach' | 'familyMember' | 'anonymousUser';

  /*
    description: 
  */
  interface IRootMutationType {
    createUser: IUserWithAuthToken | null;
    login: IUserWithAuthToken | null;
  }

  /*
    description: 
  */
  interface ICreateUserInputType {
    email: any;
    password: any;
  }

  /*
    description: The user account with an optional auth token
  */
  interface IUserWithAuthToken {
    user: IUser;
    authToken: string | null;
  }

  /*
    description: 
  */
  interface ILoginUserInputType {
    email: string;
    password: string;
  }
}
