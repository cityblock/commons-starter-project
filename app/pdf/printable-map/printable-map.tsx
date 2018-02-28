import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import Header from './header';

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

const PrintableMAP: React.StatelessComponent<IProps> = ({ carePlan, patient }) => {
  return (
    <Document title={copy.documentTitle}>
      <Page size="A4">
        <View style={styles.border} fixed />
        <View style={styles.container}>
          <Header />
        </View>
      </Page>
    </Document>
  );
};

export default PrintableMAP;
