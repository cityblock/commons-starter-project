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
          name="tasks"
          selected={selected}
          routeBase={ROUTE_BASE}
          icon="notifications"
          iconStyles={styles.redIcon}
          noDivider={selected === 'team'}
        />
        <NavigationItem
          name="team"
          selected={selected}
          routeBase={ROUTE_BASE}
          icon="addCircle"
          iconStyles={styles.greenIcon}
          noDivider={selected === 'suggestions'}
        />
        <NavigationItem
          name="suggestions"
          selected={selected}
          routeBase={ROUTE_BASE}
          icon="playlistAdd"
          iconStyles={styles.redIcon}
          noDivider={true}
        />
      </div>
    </div>
  );
};

export default DashboardNavigation;
