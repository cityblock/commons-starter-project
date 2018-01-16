import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Selected } from '../dashboard-container';
import * as styles from './css/navigation.css';
import NavigationItem from './navigation-item';

export const ROUTE_BASE = '/dashboard';

interface IProps {
  selected: Selected;
  tagId?: string;
}

const DashboardNavigation: React.StatelessComponent<IProps> = (props: IProps) => {
  const { selected } = props;
  const firstSelected = selected === 'tasks';

  const headerStyles = classNames(styles.header, {
    [styles.widenHeader]: firstSelected,
  });
  const listStyles = classNames(styles.list, {
    [styles.transparentBorder]: firstSelected,
  });

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
          noDivider={true}
        />
      </div>
    </div>
  );
};

export default DashboardNavigation;
