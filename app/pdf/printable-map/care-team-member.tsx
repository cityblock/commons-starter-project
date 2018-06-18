import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import { FullCareTeamUserFragment } from '../../graphql/types';
import {
  formatCareTeamMemberRole,
  formatFullName,
  formatPhoneNumber,
} from '../../shared/helpers/format-helpers';
import TextGroup from '../shared/text-group';
import variables from '../shared/variables/variables';

interface IProps {
  user: FullCareTeamUserFragment;
  index: number;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: variables.roboto,
    fontSize: variables.smallFontSize,
    color: variables.grayColor,
    marginTop: 3,
  },
});

const CareTeamMember: React.StatelessComponent<IProps> = ({ user, index }) => {
  const label = formatFullName(user.firstName, user.lastName);
  const role = formatCareTeamMemberRole(user.userRole);
  const value = formatPhoneNumber(user.phone);
  const isLead = user.isCareTeamLead;
  const valueColor = isLead ? 'blue' : 'gray';

  return (
    <View>
      <TextGroup
        key={index}
        label={label}
        value={value}
        valueColor={valueColor}
        fullWidth={true}
        starImage={isLead}
      />
      <Text style={styles.text}>{role}</Text>
    </View>
  );
};

export default CareTeamMember;
