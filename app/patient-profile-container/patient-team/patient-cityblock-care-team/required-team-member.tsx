import * as React from 'react';
import { getPatientCareTeamQuery } from '../../../graphql/types';
import RequiredPlaceholder from '../../required-placeholder';

type RequiredRoleTypes = 'communityHealthPartner' | 'primaryCarePhysician';

interface IProps {
  patientCareTeam?: getPatientCareTeamQuery['patientCareTeam'];
  isLoading?: boolean;
  requiredRoleType: RequiredRoleTypes;
  onClick: () => void;
}

const patientHasRequiredTeamMember = (
  patientCareTeam: getPatientCareTeamQuery['patientCareTeam'],
  requiredRoleType: RequiredRoleTypes,
): boolean => {
  return (
    patientCareTeam.filter(careTeamMember => careTeamMember.userRole === requiredRoleType).length >
    0
  );
};

const RequiredTeamMember: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientCareTeam, isLoading, requiredRoleType, onClick } = props;
  let headerMessageId = '';
  let subtextMessageId = '';

  if (requiredRoleType === 'communityHealthPartner') {
    headerMessageId = 'patientTeam.missingChpHeader';
    subtextMessageId = 'patientTeam.missingChpSubtext';
  } else if (requiredRoleType === 'primaryCarePhysician') {
    headerMessageId = 'patientTeam.missingPcpHeader';
    subtextMessageId = 'patientTeam.missingPcpSubtext';
  }

  if (isLoading || patientHasRequiredTeamMember(patientCareTeam || [], requiredRoleType)) {
    return null;
  } else {
    return (
      <RequiredPlaceholder
        onClick={onClick}
        headerMessageId={headerMessageId}
        subtextMessageId={subtextMessageId}
      />
    );
  }
};

export default RequiredTeamMember;
