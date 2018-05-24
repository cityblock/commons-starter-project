import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

interface IProps {
  label: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.lightGrayColor,
    minHeight: 60,
    borderTopWidth: variables.smallBorder,
    borderTopColor: variables.darkGrayColor,
    borderBottomWidth: variables.smallBorder,
    borderBottomColor: variables.grayColor,
  },
  text: {
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    textAlign: variables.flexCenter,
    marginTop: variables.mediumGutter,
  },
});

const Empty: React.StatelessComponent<IProps> = (props: IProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.label}</Text>
    </View>
  );
};

export default Empty;
