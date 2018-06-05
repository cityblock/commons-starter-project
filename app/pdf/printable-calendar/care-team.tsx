import { View } from '@react-pdf/core';
import * as React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import HeaderText from '../shared/header-text';
import CareTeamMember from './care-team-member';
import copy from './copy/copy';

interface IProps {
  careTeam: FullCareTeamUserFragment[];
}

const CareTeam: React.StatelessComponent<IProps> = ({ careTeam }) => {
  careTeam.sort((a, b) => {
    if (a.isCareTeamLead) {
      return -1;
    } else if (b.isCareTeamLead) {
      return 1;
    }
    return 0;
  });

  const careTeamMembers = careTeam.map((user, i) => (
    <CareTeamMember key={`careTeam-${i}`} index={i} user={user} />
  ));

  return (
    <View>
      <HeaderText label={copy.careTeam} />
      {careTeamMembers}
    </View>
  );
};

export default CareTeam;
