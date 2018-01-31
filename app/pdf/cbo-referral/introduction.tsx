import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullTaskForCBOReferralFormPDFFragment, FullUserFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import BodyText from './body-text';
import copy from './copy/copy';
import Divider from './divider';
import HeaderText from './header-text';
import TextGroup from './text-group';
import variables from './variables/variables';

interface IProps {
  task: FullTaskForCBOReferralFormPDFFragment;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexColumn,
  },
  intro: {
    flexDirection: variables.flexRow,
    alignItems: variables.flexCenter,
    flexWrap: variables.flexWrap,
  },
  bold: {
    fontFamily: variables.robotoBold,
    fontSize: variables.bodyFontSize,
    lineHeight: variables.bodyLineHeight,
    color: variables.blackColor,
    marginTop: variables.bodyMarginTop,
  },
  divider: {
    marginTop: variables.mediumGutter,
    marginBottom: variables.smallGutter,
    width: variables.full,
  },
  body: {
    flexDirection: variables.flexRow,
    alignItems: variables.flexCenter,
    flexWrap: variables.flexWrap,
    marginTop: variables.mediumGutter,
  },
});

const Introduction: React.StatelessComponent<IProps> = ({ task }) => {
  const category = task.CBOReferral!.category.title;

  // use assignee as person referring if they exist, otherwise use task creator
  const referredBy = task.assignedTo || task.createdBy;
  const referredByName = formatFullName(referredBy.firstName, referredBy.lastName);

  // Note: assuming only one physician on care team for now, later can modify this logic
  const careTeamPCP = (task.patient.careTeam || []).find(
    (user: FullUserFragment) => user.userRole === 'physician',
  );

  return (
    <View style={styles.container}>
      <HeaderText label={copy.introduction} />
      <View style={styles.intro}>
        <BodyText label={copy.introBody} />
        <Text style={styles.bold}>{category}</Text>
      </View>
      <View style={styles.body}>
        <TextGroup headerLabel={copy.referredBy} bodyLabel={referredByName} />
        <TextGroup headerLabel={copy.careTeamPhone} bodyLabel={referredBy.phone || copy.unknown} />
        <TextGroup headerLabel={copy.careTeamEmail} bodyLabel={referredBy.email || copy.unknown} />
      </View>
      {!!careTeamPCP && (
        <View style={styles.body}>
          <TextGroup
            headerLabel={copy.careTeamPCP}
            bodyLabel={`Dr. ${formatFullName(careTeamPCP.firstName, careTeamPCP.lastName)}`}
          />
        </View>
      )}
      <View style={styles.divider}>
        <Divider />
      </View>
    </View>
  );
};

export default Introduction;