import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import Footer from './footer';
import Header from './header';
import Info from './info';

interface IProps {
  carePlan: FullPatientConcernFragment[];
  careTeam: FullUserFragment[];
  patient: FullPatientForProfileFragment;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.whiteColor,
    paddingTop: variables.mediumGutter,
    paddingBottom: variables.mediumGutter,
    paddingRight: variables.smallGutter,
    paddingLeft: variables.smallGutter,
  },
  border: {
    backgroundColor: variables.blueColor,
    height: variables.bigBorder,
  },
});

const PrintableMAP: React.StatelessComponent<IProps> = ({ carePlan, careTeam, patient }) => {
  // only get active concerns (have been started but not completed)
  const activeConcerns = carePlan.filter(concern => !!concern.startedAt && !concern.completedAt);

  return (
    <Document title={copy.documentTitle}>
      <Page size="A4">
        <View style={styles.border} fixed />
        <View style={styles.container}>
          <Header />
          <Info patient={patient} careTeam={careTeam} carePlan={activeConcerns} />
        </View>
        <Footer patient={patient} />
      </Page>
    </Document>
  );
};

export default PrintableMAP;
