import { Document, Page, StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  carePlan: FullPatientConcernFragment[];
  careTeam: FullUserFragment[];
  patient: FullPatientForProfileFragment;
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: variables.blueColor,
    height: variables.bigBorder,
  },
});

const PrintableMAP: React.StatelessComponent<IProps> = ({ carePlan, patient }) => {
  return (
    <Document title={copy.documentTitle}>
      <Page size="A4">
        <View style={styles.border} />
        <View>
          <Text>Printable MAP Placeholder</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrintableMAP;
