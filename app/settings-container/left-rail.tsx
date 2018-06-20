import React from 'react';
import { graphql } from 'react-apollo';
import currentUserEditGraphql from '../graphql/queries/current-user-edit-mutation.graphql';
import { currentUserEdit, currentUserEditVariables, FullUser } from '../graphql/types';
import Text from '../shared/library/text/text';
import AutomatedResponse from './automated-response';
import styles from './css/left-rail.css';
import StatusToggle from './status-toggle';

interface IProps {
  currentUser: FullUser;
}

interface IGraphqlProps {
  editCurrentUser: (options: { variables: currentUserEditVariables }) => { data: currentUserEdit };
}

type allProps = IProps & IGraphqlProps;

export const SettingsLeftRail: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    currentUser: { isAvailable, awayMessage },
    editCurrentUser,
  } = props;

  return (
    <div className={styles.container}>
      <div>
        <Text
          messageId="settings.workHours"
          font="baseticaBold"
          color="black"
          isHeader
          className={styles.header}
        />
        <Text messageId="settings.workHoursDetail" size="medium" color="gray" />
      </div>
      <StatusToggle isAvailable={isAvailable} editCurrentUser={editCurrentUser} />
      <AutomatedResponse awayMessage={awayMessage} editCurrentUser={editCurrentUser} />
    </div>
  );
};

export default graphql<any>(currentUserEditGraphql, {
  name: 'editCurrentUser',
})(SettingsLeftRail) as React.ComponentClass<IProps>;
