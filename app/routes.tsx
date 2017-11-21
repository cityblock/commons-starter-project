import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Authentication from './authentication-container/authentication-container';
import BuilderContainer from './builder-container/builder-container';
/* tslint:disable:max-line-length */
import EventNotificationsContainer from './event-notifications-container/event-notifications-container';
/* tslint:enable:max-line-length */
import LogIn from './login-container/login-container';
import Main from './main-container/main-container';
import ManagerContainer from './manager-container/manager-container';
/* tslint:disable:max-line-length */
import PatientEnrollmentContainer from './patient-enrollment-container/patient-enrollment-container';
/* tslint:enable:max-line-length */
import PatientPanelContainer from './patient-panel-container/patient-panel-container';
import PatientProfileContainer from './patient-profile-container/patient-profile-container';
import SettingsContainer from './settings-container/settings-container';
import TasksContainer from './tasks-container/tasks-container';

const PatientRedirect = (options: any) => (
  <Redirect to={`/patients/${options.match.params.patientId}/map/active`} />
);

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 */
export default (
  <Main>
    <Switch>
      <Route exact path="/" component={LogIn} />
      <Authentication>
        <Route
          exact
          path="/notifications/:eventNotificationType?"
          component={EventNotificationsContainer}
        />
        <Route exact path="/tasks/:taskId?" component={TasksContainer} />
        <Route exact path="/settings" component={SettingsContainer} />
        <Route exact path="/patient-intake" component={PatientEnrollmentContainer} />
        <Route exact path="/patients" component={PatientPanelContainer} />
        <Route exact path="/patients/:patientId" component={PatientRedirect} />
        <Route path="/patients/:patientId/:tab" component={PatientProfileContainer} />
        <Route
          exact
          path="/builder/:tab?/:objectId?/:subTab?/:subTabId?"
          component={BuilderContainer as any}
        />
        <Route exact path="/manager/:tabId?/:objectId?" component={ManagerContainer as any} />
      </Authentication>
    </Switch>
  </Main>
);
