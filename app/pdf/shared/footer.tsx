import { StyleSheet, Text, View } from '@react-pdf/core';
import { format } from 'date-fns';
import React from 'react';
import { FullPatientForProfile } from '../../graphql/types';
import { formatPatientName } from '../../shared/helpers/format-helpers';
import copy from './copy/copy';
import variables from './variables/variables';

interface IProps {
  patient: FullPatientForProfile;
  title: string;
}

const styles = StyleSheet.create({
  container: {
    position: variables.absolute,
    bottom: variables.mediumGutter,
    left: variables.smallGutter,
  },
  text: {
    fontFamily: variables.roboto,
    fontSize: variables.smallFontSize,
    color: variables.darkGrayColor,
  },
});

const Footer: React.StatelessComponent<IProps> = ({ patient, title }) => {
  const patientName = formatPatientName(patient);
  const formattedDate = format(Date.now(), 'MMM D, YYYY');

  const footerText = `${title} ${patientName}  |  ${copy.printedOn} ${formattedDate}`;

  return (
    <View style={styles.container} fixed>
      <Text style={styles.text} fixed>
        {footerText}
      </Text>
    </View>
  );
};

export default Footer;
