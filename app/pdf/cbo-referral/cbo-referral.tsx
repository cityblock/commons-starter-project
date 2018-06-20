import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import React from 'react';
import { FullTaskForCBOReferralFormPDF } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import Footer from './footer';
import Header from './header';
import Introduction from './introduction';
import PatientInfo from './patient-info';
import Title from './title';

interface IProps {
  task: FullTaskForCBOReferralFormPDF;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.whiteColor,
    height: variables.full,
    padding: variables.gutter,
  },
  border: {
    backgroundColor: variables.blueColor,
    height: variables.bigBorder,
  },
});

const CBOReferral: React.StatelessComponent<IProps> = ({ task }) => {
  if (!task || !task.CBOReferral) return null;

  const CBOName = task.CBOReferral.CBO
    ? task.CBOReferral.CBO.name
    : (task.CBOReferral.name as string);

  return (
    <Document title={copy.documentTitle}>
      <Page size="A4">
        <View style={styles.border} />
        <View style={styles.container}>
          <Header referredOn={task.CBOReferral.sentAt} />
          <Title CBOName={CBOName} />
          <Introduction task={task} />
          <PatientInfo patient={task.patient} description={task.description} />
          <Footer />
        </View>
      </Page>
    </Document>
  );
};

export default CBOReferral;
