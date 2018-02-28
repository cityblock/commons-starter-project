import { View } from '@react-pdf/core';
import * as React from 'react';
import { FullUserFragment } from '../../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../../shared/helpers/format-helpers';
import HeaderText from '../shared/header-text';
import copy from './copy/copy';
import TextGroup from './text-group';

interface IProps {
  careTeam: FullUserFragment[];
}

const CareTeamList: React.StatelessComponent<IProps> = ({ careTeam }) => {
  const careTeamMembers = careTeam.map((user, i) => {
    const label = formatFullName(user.firstName, user.lastName);
    const value = formatCareTeamMemberRole(user.userRole);

    return <TextGroup key={i} label={label} value={value} valueColor="gray" fullWidth={true} />;
  });

  return (
    <View>
      <HeaderText label={copy.careTeam} />
      {careTeamMembers}
    </View>
  );
};

export default CareTeamList;
