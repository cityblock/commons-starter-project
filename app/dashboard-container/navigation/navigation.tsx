import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientListsQuery from '../../graphql/queries/get-patient-lists.graphql';
import { FullPatientListFragment } from '../../graphql/types';
import { Selected } from '../dashboard-container';
import ComputedLists from './computed-lists';
import * as styles from './css/navigation.css';
import NavigationItem from './navigation-item';

export const ROUTE_BASE = '/dashboard';

interface IGraphqlProps {
  patientLists: FullPatientListFragment[];
  loading: boolean;
  error: string | null;
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
          noDivider={selected === 'new'}
        />
        <NavigationItem
          selected="new"
          isSelected={selected === 'new'}
          routeBase={ROUTE_BASE}
          icon="addCircle"
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

export default graphql<IGraphqlProps, IProps, allProps>(patientListsQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientLists: data ? (data as any).patientLists : null,
  }),
})(DashboardNavigation);
