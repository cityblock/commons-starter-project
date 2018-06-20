import { StyleSheet, View } from '@react-pdf/core';
import React from 'react';
import { FullCareTeamUser } from '../../graphql/types';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import CareTeamMember from './care-team-member';
import copy from './copy/copy';

interface IProps {
  careTeam: FullCareTeamUser[];
}

const styles = StyleSheet.create({
  container: {
    width: variables.half,
    paddingLeft: variables.extraSmallGutter,
    paddingBottom: variables.smallGutter,
    flexShrink: 0,
    flexGrow: 1,
  },
});

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
    <View style={styles.container}>
      <HeaderText label={copy.careTeam} />
      {careTeamMembers}
    </View>
  );
};

export default CareTeam;
