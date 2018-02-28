import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import TextGroup from './text-group';

interface IProps {
  leadFirstName: string;
  leadPhone: string;
  careTeamPhone: string;
}

const styles = StyleSheet.create({
  container: {
    marginTop: variables.mediumGutter,
  },
});

const ContactList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { leadFirstName, leadPhone, careTeamPhone } = props;

  const leadLabel = `${copy.textOrCall} ${leadFirstName}:`;
  const careTeamLabel = `${copy.textOrCall} ${copy.careTeam}`;

  return (
    <View style={styles.container}>
      <HeaderText label={copy.contact} />
      <TextGroup label={leadLabel} value={leadPhone} fullWidth={true} />
      <TextGroup label={careTeamLabel} value={careTeamPhone} fullWidth={true} />
    </View>
  );
};

export default ContactList;
