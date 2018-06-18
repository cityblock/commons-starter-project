import React from 'react';
import { compose, graphql } from 'react-apollo';
import currentUserHoursQuery from '../graphql/queries/get-current-user-hours.graphql';
import currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { getCurrentUserHoursQuery, FullUserFragment } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import Text from '../shared/library/text/text';
import styles from './css/settings-container.css';
import SettingsLeftRail from './left-rail';
import WorkHours from './work-hours';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  currentUser: FullUserFragment | null;
  currentUserHours: getCurrentUserHoursQuery['currentUserHours'] | null;
  userLoading?: boolean;
  userError?: string | null;
  hoursLoading?: boolean;
  hoursError?: string | null;
}

type allProps = IProps & IGraphqlProps;

export const SettingsContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  const { userLoading, hoursLoading, userError, hoursError, currentUser, currentUserHours } = props;

  // return spinner if loading
  if (userLoading || hoursLoading || userError || hoursError || !currentUser || !currentUserHours) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <Text messageId="settings.settings" color="black" font="baseticaBold" isHeader />
      <div className={styles.divider} />
      <div className={styles.workHours}>
        <SettingsLeftRail currentUser={currentUser} />
        <WorkHours currentUserHours={currentUserHours} disabled={!currentUser.isAvailable} />
      </div>
    </div>
  );
};

export default compose(
  graphql(currentUserQuery, {
    props: ({ data }) => ({
      userLoading: data ? data.loading : false,
      userError: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
  graphql(currentUserHoursQuery, {
    props: ({ data }) => ({
      hoursLoading: data ? data.loading : false,
      hoursError: data ? data.error : null,
      currentUserHours: data ? (data as any).currentUserHours : null,
    }),
  }),
)(SettingsContainer) as React.ComponentClass<IProps>;
