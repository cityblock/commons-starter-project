// Utility code for converting between Db and GraphQL types.

import { IUser } from 'schema';
import User from '../../models/user';

interface IGeneratedFields {
  id: string;
  createdAt: string;
}

interface IGraphQLGenerated {
  id: string;
  createdAt: string;
}

function convertGenerated(fields: IGeneratedFields): IGraphQLGenerated {
  return {
    id: fields.id,
    createdAt: fields.createdAt,
  };
}

export function convertUser(user: User): IUser {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userRole: user.userRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    homeClinicId: user.homeClinicId,
    locale: user.locale,
    phone: user.phone,
    googleProfileImageUrl: user.googleProfileImageUrl,
    ...convertGenerated(user),
  };
}
