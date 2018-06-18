import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import patientListsQuery from '../../graphql/queries/get-patient-lists.graphql';
import { FullPatientListFragment } from '../../graphql/types';
import { Selected } from '../dashboard-container';
import ComputedLists from './computed-lists';
import styles from './css/navigation.css';
import NavigationItem from './navigation-item';

export const ROUTE_BASE = '/dashboard';

interface IGraphqlProps {
  patientLists: FullPatientListFragment[];
  loading: boolean;
  error: ApolloError | null | undefined;
}

interface IProps {
  selected: Selected;
  answerId: string | null;
}

type allProps = IGraphqlProps & IProps;

export const DashboardNavigation: React.StatelessComponent<allProps> = (props: allProps) => {
  const { selected, loading, error, patientLists, answerId } = props;
  const firstSelected = selected === 'tasks';

  const headerStyles = classNames(styles.header, {
    [styles.widenHeader]: firstSelected,
  });
  const listStyles = classNames(styles.list, {
    [styles.transparentBorder]: firstSelected,
  });
  const dividerLast =
    !loading &&
    !error &&
    patientLists.length &&
    selected === 'computed' &&
    patientLists[0].answerId === answerId;

  return (
    <div className={styles.container}>
      <FormattedMessage id="dashboard.lists">
        {(message: string) => (
          <div className={headerStyles}>
            <h2>{message}</h2>
          </div>
        )}
      </FormattedMessage>
      <div className={listStyles}>
        <NavigationItem
          selected="tasks"
          isSelected={selected === 'tasks'}
          routeBase={ROUTE_BASE}
          icon="notifications"
          noDivider={selected === 'conversations'}
        />
        <NavigationItem
          selected="conversations"
          isSelected={selected === 'conversations'}
          routeBase={ROUTE_BASE}
          icon="chat"
          noDivider={selected === 'referrals'}
        />
        <NavigationItem
          selected="referrals"
          isSelected={selected === 'referrals'}
          routeBase={ROUTE_BASE}
          icon="assignmentInd"
          noDivider={selected === 'new'}
        />
        <NavigationItem
          selected="new"
          isSelected={selected === 'new'}
          routeBase={ROUTE_BASE}
          icon="addCircle"
          noDivider={selected === 'assigned'}
        />
        <NavigationItem
          selected="assigned"
          isSelected={selected === 'assigned'}
          routeBase={ROUTE_BASE}
          icon="assignment"
          noDivider={selected === 'intake'}
        />
        <NavigationItem
          selected="intake"
          isSelected={selected === 'intake'}
          routeBase={ROUTE_BASE}
          icon="list"
          noDivider={selected === 'suggestions'}
        />
        <NavigationItem
          selected="suggestions"
          isSelected={selected === 'suggestions'}
          routeBase={ROUTE_BASE}
          icon="playlistAdd"
          noDivider={selected === 'demographics'}
        />
        <NavigationItem
          selected="demographics"
          isSelected={selected === 'demographics'}
          routeBase={ROUTE_BASE}
          icon="infoOutline"
          noDivider={selected === 'engage'}
        />
        <NavigationItem
          selected="engage"
          isSelected={selected === 'engage'}
          routeBase={ROUTE_BASE}
          icon="syncProblem"
          noDivider={selected === 'updateMAP'}
        />
        <NavigationItem
          selected="updateMAP"
          isSelected={selected === 'updateMAP'}
          routeBase={ROUTE_BASE}
          icon="accessAlarms"
          noDivider={dividerLast}
        />
        <ComputedLists
          patientLists={patientLists}
          loading={loading}
          error={error}
          routeBase={ROUTE_BASE}
          answerId={answerId}
        />
      </div>
    </div>
  );
};

export default graphql<any, any, any, any>(patientListsQuery, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientLists: data ? (data as any).patientLists : null,
  }),
})(DashboardNavigation) as React.ComponentClass<IProps>;
