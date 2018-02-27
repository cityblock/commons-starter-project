import { Document, Page, Text, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import copy from './copy/copy';

interface IProps {
  carePlan: FullPatientConcernFragment[];
  careTeam: FullUserFragment[];
  patient: FullPatientForProfileFragment;
}

const PrintableMAP: React.StatelessComponent<IProps> = ({ carePlan, patient }) => {
  return (
    <Document title={copy.documentTitle}>
      <Page size="A4">
        <View>
          <Text>Printable MAP Placeholder</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrintableMAP;
