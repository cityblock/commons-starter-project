declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IRootQueryType {

    /**
     * All puppies
     */
    puppies: Array<IPuppy>;
  }

  /**
   * Puppy
   */
  interface IPuppy {
    id: string;
    name: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }

  /**
   * An object with a Globally Unique ID
   */
  type uniqueId = IPuppy;

  /**
   * An object with a Globally Unique ID
   */
  interface IUniqueId {

    /**
     * The ID of the object.
     */
    id: string;
  }

  interface IRootMutationType {

    /**
     * Create a puppy
     */
    puppyCreate: IPuppy;
  }

  interface IPuppyCreateOnRootMutationTypeArguments {
    input?: IPuppyCreateInput | null;
  }

  interface IPuppyCreateInput {
    name: string;
  }
}

