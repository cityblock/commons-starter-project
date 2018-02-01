import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import copy from './copy/copy';
import Divider from './divider';
import variables from './variables/variables';

interface IProps {
  CBOName: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexColumn,
    alignItems: variables.flexCenter,
  },
  title: {
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    marginTop: variables.mediumGutter,
  },
  nameContainer: {
    justifyContent: variables.flexCenter,
    alignItems: variables.flexCenter,
    flexGrow: variables.flexGrow,
  },
  name: {
    fontFamily: variables.baseticaBold,
    fontSize: variables.CBONameFontSize,
    color: variables.blueColor,
    marginTop: variables.bodyMarginTop,
  },
  divider: {
    marginTop: variables.mediumGutter,
    marginBottom: variables.gutter,
    width: variables.full,
  },
});

const Title: React.StatelessComponent<IProps> = ({ CBOName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{copy.communityReferral}</Text>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{CBOName}</Text>
      </View>
      <View style={styles.divider}>
        <Divider />
      </View>
    </View>
  );
};

export default Title;
