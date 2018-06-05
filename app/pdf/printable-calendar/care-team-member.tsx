import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import {
  formatCareTeamMemberRole,
  formatFullName,
  formatPhoneNumber,
} from '../../shared/helpers/format-helpers';
import variables from '../shared/variables/variables';

interface IProps {
  user: FullCareTeamUserFragment;
  index: number;
}

const textStyles = {
  fontFamily: variables.roboto,
  fontSize: variables.smallFontSize,
  marginTop: 3,
  height: 15,
  width: variables.oneThird,
  flexGrow: 1,
};

const phoneStyles = {
  ...textStyles,
  textAlign: 'right',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    width: variables.full,
  },
  grayText: {
    ...textStyles,
    color: variables.grayColor,
  },
  blueText: {
    ...textStyles,
    colors: variables.blueColor,
  },
  blackText: {
    ...textStyles,
    colors: variables.blackColor,
  },
  bluePhoneText: {
    ...phoneStyles,
    colors: variables.blueColor,
  },
  blackPhoneText: {
    ...phoneStyles,
    colors: variables.blackColor,
  },
});

const CareTeamMember: React.StatelessComponent<IProps> = ({ user, index }) => {
  const label = formatFullName(user.firstName, user.lastName);
  const role = formatCareTeamMemberRole(user.userRole);
  const value = formatPhoneNumber(user.phone);
  const isLead = user.isCareTeamLead;
  const mainStyle = isLead ? styles.blueText : styles.blackText;
  const phoneStyle = isLead ? styles.bluePhoneText : styles.blackPhoneText;

  return (
    <View style={styles.container}>
      <Text style={mainStyle}>{label}</Text>
      <Text style={styles.grayText}>{role}</Text>
      <Text style={phoneStyle}>{value}</Text>
    </View>
  );
};

export default CareTeamMember;
