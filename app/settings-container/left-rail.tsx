import * as React from 'react';
import { graphql } from 'react-apollo';
import * as currentUserEditMutationGraphql from '../graphql/queries/current-user-edit-mutation.graphql';
import {
  currentUserEditMutation,
  currentUserEditMutationVariables,
  FullUserFragment,
} from '../graphql/types';
import Text from '../shared/library/text/text';
import * as styles from './css/left-rail.css';
import StatusToggle from './status-toggle';

interface IProps {
  currentUser: FullUserFragment;
}

interface IGraphqlProps {
  editCurrentUser: (
    options: { variables: currentUserEditMutationVariables },
  ) => { data: currentUserEditMutation };
}

type allProps = IProps & IGraphqlProps;

export const SettingsLeftRail: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    currentUser: { isAvailable },
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
    </div>
  );
};

export default graphql<any>(currentUserEditMutationGraphql as any, {
  name: 'editCurrentUser',
})(SettingsLeftRail) as React.ComponentClass<IProps>;
