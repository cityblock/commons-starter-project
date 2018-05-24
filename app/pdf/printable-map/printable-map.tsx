import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullCareTeamUserFragment,
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import Divider from '../shared/divider';
import Empty from '../shared/empty';
import Footer from '../shared/footer';
import Header from '../shared/header';
import variables from '../shared/variables/variables';
import Concern from './concern';
import copy from './copy/copy';
import Goal from './goal';
import Info from './info';
import Task from './task';

interface IProps {
  carePlan: FullPatientConcernFragment[];
  careTeam: FullCareTeamUserFragment[];
  patient: FullPatientForProfileFragment;
  profilePhotoUrl: string | null;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: variables.whiteColor,
    paddingBottom: variables.gutter,
  },
  container: {
    paddingRight: variables.smallGutter,
    paddingLeft: variables.smallGutter,
  },
  text: {
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    textAlign: variables.flexCenter,
  },
});

const PrintableMAP: React.StatelessComponent<IProps> = (props: IProps) => {
  const { carePlan, careTeam, patient, profilePhotoUrl } = props;

  // only get active concerns (have been started but not completed)
  const activeConcerns = carePlan.filter(concern => !!concern.startedAt && !concern.completedAt);

  const renderedCarePlan: JSX.Element[] = activeConcerns.length
    ? []
    : [<Empty label={copy.noCarePlan} />];

  // get each item in care plan in list to avoid deep nesting
  activeConcerns.forEach((patientConcern, i) => {
    const renderedConcern = (
      <Concern key={patientConcern.id} patientConcern={patientConcern} index={i} />
    );
    renderedCarePlan.push(renderedConcern);

    (patientConcern.patientGoals || []).forEach((patientGoal, j) => {
      const renderedGoal = <Goal key={patientGoal.id} patientGoal={patientGoal} />;
      renderedCarePlan.push(renderedGoal);

      patientGoal.tasks.forEach((task, k) => {
        const isLastInGoal = k >= patientGoal.tasks.length - 1;
        const isLastGoal = j >= (patientConcern.patientGoals || []).length - 1;
        const isLastInConcern = isLastInGoal && isLastGoal;

        const renderedTask = <Task key={task.id} task={task} isLastInConcern={isLastInConcern} />;
        renderedCarePlan.push(renderedTask);
      });
    });
  });

  return (
    <Document title={copy.documentTitle}>
      <Page size="A4" style={styles.page} wrap>
        <Header title={copy.map} />
        <View style={styles.container}>
          <Divider color="darkGray" />
          <Info
            patient={patient}
            careTeam={careTeam}
            carePlan={activeConcerns}
            profilePhotoUrl={profilePhotoUrl}
          />
          {renderedCarePlan}
        </View>
        <Footer patient={patient} title={copy.mapAbbrev} />
      </Page>
    </Document>
  );
};

export default PrintableMAP;
