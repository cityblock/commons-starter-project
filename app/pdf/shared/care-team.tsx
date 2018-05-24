import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import CareTeamMember from './care-team-member';
import copy from './copy/copy';
import HeaderText from './header-text';

interface IProps {
  careTeam: FullCareTeamUserFragment[];
}

const styles = StyleSheet.create({
  container: {
    width: variables.half,
    paddingLeft: variables.extraSmallGutter,
    paddingBottom: variables.smallGutter,
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
