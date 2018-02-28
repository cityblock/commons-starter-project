import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullUserFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import CareTeamList from './care-team-list';
import ContactList from './contact-list';
import copy from './copy/copy';

interface IProps {
  careTeam: FullUserFragment[];
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
  const leadFirstName = careTeam.length ? careTeam[0].firstName || copy.unknown : copy.noLead;

  return (
    <View style={styles.container}>
      <CareTeamList careTeam={careTeam} />
      <ContactList
        leadFirstName={leadFirstName}
        leadPhone="142-719-8667"
        careTeamPhone="371-402-0313"
      />
    </View>
  );
};

export default CareTeam;
