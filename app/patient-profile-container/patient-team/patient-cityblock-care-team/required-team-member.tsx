import React from 'react';
import { getPatientCareTeam } from '../../../graphql/types';
import RequiredPlaceholder from '../../required-placeholder';

type RequiredRoleTypes = 'Community_Health_Partner' | 'Primary_Care_Physician';

interface IProps {
  patientCareTeam?: getPatientCareTeam['patientCareTeam'];
  isLoading?: boolean;
  requiredRoleType: RequiredRoleTypes;
  onClick: () => void;
}

const patientHasRequiredTeamMember = (
  patientCareTeam: getPatientCareTeam['patientCareTeam'],
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

  if (requiredRoleType === 'Community_Health_Partner') {
    headerMessageId = 'patientTeam.missingChpHeader';
    subtextMessageId = 'patientTeam.missingChpSubtext';
  } else if (requiredRoleType === 'Primary_Care_Physician') {
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
