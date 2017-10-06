import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as tabStyles from '../shared/css/tabs.css';
import { IState as IAppState } from '../store';
import * as styles from './css/manager.css';
import ManagerLeftNav from './manager-left-nav';
import ManagerUsers from './manager-users';

interface IProps {
  tabId: 'invites' | 'users';
  match: {
    params: {
      tabId?: 'invites' | 'users';
    };
  };
}

class ManagerContainer extends React.Component<IProps, {}> {
  render() {
    const { tabId } = this.props;
    const usersTabSelected = tabId === 'users';
    const invitesTabSelected = tabId === 'invites';
    const usersTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: usersTabSelected,
    });
    const invitesTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: invitesTabSelected,
    });
    const usersHtml = usersTabSelected ? (
      <ManagerUsers hasLoggedIn={true} routeBase={`/manager/users`} />
    ) : null;
    const invitesHtml = invitesTabSelected ? (
      <ManagerUsers hasLoggedIn={false} routeBase={`/manager/invites`} />
    ) : null;
    return (
      <div className={styles.container}>
        <ManagerLeftNav />
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <Link to={`/manager/users`} className={usersTabStyles}>
              Users
            </Link>
            <Link to={`/manager/invites`} className={invitesTabStyles}>
              Invites
            </Link>
          </div>
          {usersHtml}
          {invitesHtml}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    tabId: ownProps.match.params.tabId || 'users',
  };
}

export default connect(mapStateToProps)(ManagerContainer);
