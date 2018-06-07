import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import * as styles from './css/manager.css';
import ManagerUsers from './manager-users';

interface IProps {
  tabId: 'invites' | 'users';
  match: {
    params: {
      tabId?: 'invites' | 'users' | null;
    };
  };
}

export const ManagerContainer = (props: IProps) => {
  const { tabId } = props;
  const usersTabSelected = tabId === 'users';
  const invitesTabSelected = tabId === 'invites';
  return (
    <div className={styles.container}>
      <div className={styles.mainBody}>
        <UnderlineTabs color="white">
          <UnderlineTab
            href={`/manager/users`}
            selected={usersTabSelected}
            messageId="manager.users"
          />
          <UnderlineTab
            href={`/manager/invites`}
            selected={invitesTabSelected}
            messageId="manager.invites"
          />
        </UnderlineTabs>
        <Switch>
          <Route
            exact
            path="/manager/users"
            component={() => <ManagerUsers hasLoggedIn={true} routeBase={`/manager/users`} />}
          />
          <Route
            exact
            path="/manager/invites"
            component={() => <ManagerUsers hasLoggedIn={false} routeBase={`/manager/invites`} />}
          />
        </Switch>
      </div>
    </div>
  );
};

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    tabId: ownProps.match.params.tabId || 'users',
  };
}

export default connect(mapStateToProps)(ManagerContainer);
