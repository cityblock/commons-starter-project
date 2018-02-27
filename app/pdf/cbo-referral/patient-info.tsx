import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientForCBOReferralFormPDFFragment } from '../../graphql/types';
import { formatDateOfBirth, formatGender } from '../../shared/helpers/format-helpers';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import TextGroup from './text-group';

interface IProps {
  patient: FullPatientForCBOReferralFormPDFFragment;
  description: string | null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexColumn,
  },
  body: {
    flexDirection: variables.flexRow,
    alignItems: variables.flexCenter,
    flexWrap: variables.flexWrap,
    marginTop: variables.mediumGutter,
  },
});

const PatientInfo: React.StatelessComponent<IProps> = ({ patient, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextGroup headerLabel={copy.patientFirstName} bodyLabel={patient.firstName} />
        <TextGroup headerLabel={copy.patientLastName} bodyLabel={patient.lastName} />
        <TextGroup headerLabel={copy.patientCityblockID} bodyLabel="CBH-1234567" />
      </View>
      <View style={styles.body}>
        <TextGroup
          headerLabel={copy.patientDoB}
          bodyLabel={formatDateOfBirth(patient.dateOfBirth)}
        />
        <TextGroup
          headerLabel={copy.patientGender}
          bodyLabel={formatGender(patient.patientInfo.gender)}
        />
        <TextGroup
          headerLabel={copy.patientLanguage}
          bodyLabel={patient.patientInfo.language || copy.unknown}
        />
      </View>
      <View style={styles.body}>
        <TextGroup headerLabel={copy.patientPhone} bodyLabel="123-456-7890" />
        <TextGroup
          headerLabel={copy.patientAddress}
          bodyLabel="1234 Main Street Apt 2A, Brooklyn, NY 11238"
          size="medium"
        />
      </View>
      <View style={styles.body}>
        <TextGroup headerLabel={copy.patientInsurancePlan} bodyLabel="Medicaid" />
        <TextGroup headerLabel={copy.patientInsuranceID} bodyLabel="111-11-1111-A" />
      </View>
      <View style={styles.body}>
        <TextGroup
          headerLabel={copy.referralNote}
          bodyLabel={description || copy.notAvailable}
          size="large"
        />
      </View>
    </View>
  );
};

export default PatientInfo;
