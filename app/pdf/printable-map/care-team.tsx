import { StyleSheet, View } from '@react-pdf/core';
import { find } from 'lodash';
import * as React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import CareTeamList from './care-team-list';
import ContactList from './contact-list';
import copy from './copy/copy';

interface IProps {
  careTeam: FullCareTeamUserFragment[];
}

const styles = StyleSheet.create({
  container: {
    width: variables.half,
    paddingLeft: variables.extraSmallGutter,
    paddingBottom: variables.smallGutter,
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexSpaceBetween,
  },
});

const CareTeam: React.StatelessComponent<IProps> = ({ careTeam }) => {
  const careTeamLead = find(careTeam, ['isCareTeamLead', true]);
  const leadFirstName = careTeamLead ? careTeamLead.firstName || copy.unknown : copy.noLead;
  const leadPhone = careTeamLead ? careTeamLead.phone || copy.unknown : copy.noLead;

  return (
    <View style={styles.container}>
      <CareTeamList careTeam={careTeam} />
      <ContactList
        leadFirstName={leadFirstName}
        leadPhone={leadPhone}
        careTeamPhone="371-402-0313"
      />
    </View>
  );
};

export default CareTeam;
