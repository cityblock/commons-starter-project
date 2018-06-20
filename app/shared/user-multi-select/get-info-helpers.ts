import { FullPatientContact, FullPatientExternalProvider, UserRole } from '../../graphql/types';
import { formatFullName } from '../helpers/format-helpers';
import { IUser } from './user-multi-select';

interface IUserFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  googleProfileImageUrl: string | null;
}

export const getUserInfo = (user: IUserFragment, isPermanent?: boolean) => {
  return {
    id: user.id,
    email: user.email,
    avatar: user.googleProfileImageUrl,
    name: formatFullName(user.firstName, user.lastName),
    role: user.userRole,
    isPermanent: isPermanent || false,
  } as IUser;
};

export const getProviderInfo = (provider: FullPatientExternalProvider) => {
  return {
    id: provider.id,
    name: formatFullName(provider.firstName, provider.lastName),
    roleMessageId: provider.role ? `externalProviderRole.${provider.role}` : null,
    role: provider.roleFreeText,
  } as IUser;
};

export const getFamilyMemberInfo = (member: FullPatientContact) => {
  return {
    id: member.id,
    name: formatFullName(member.firstName, member.lastName),
    roleMessageId: member.relationToPatient
      ? `relationToPatient.${member.relationToPatient}`
      : null,
    role: member.relationFreeText,
  } as IUser;
};
