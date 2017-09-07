import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminContainer from './admin-container/admin-container';
import Authentication from './authentication-container/authentication-container';
/* tslint:disable:max-line-length */
import EventNotificationsContainer from './event-notifications-container/event-notifications-container';
/* tslint:enable:max-line-length */
import LogIn from './login-container/login-container';
import Main from './main-container/main-container';
/* tslint:disable:max-line-length */
import PatientEnrollmentContainer from './patient-enrollment-container/patient-enrollment-container';
/* tslint:enable:max-line-length */
import PatientPanelContainer from './patient-panel-container/patient-panel-container';
import PatientProfileContainer from './patient-profile-container/patient-profile-container';
import SettingsContainer from './settings-container/settings-container';
import TasksContainer from './tasks-container/tasks-container';

const PatientRedirect = (options: any) => (
  <Redirect to={`/patients/${options.match.params.patientId}/encounters`} />
);

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 */
export default (
  <Main>
    <Switch>
      <Route exact path='/' component={(LogIn as any)} />
      <Authentication>
        <Route
          exact
          path='/notifications/:eventNotificationType?'
          component={(EventNotificationsContainer as any)} />
        <Route exact path='/tasks/:taskId?' component={(TasksContainer as any)} />
        <Route exact path='/settings' component={(SettingsContainer as any)} />
        <Route exact path='/patient-intake' component={(PatientEnrollmentContainer as any)} />
        <Route exact path='/patients' component={(PatientPanelContainer as any)} />
        <Route exact path='/patients/:patientId' component={(PatientRedirect as any)} />
        <Route
          exact
          path='/patients/:patientId/:tabId/:riskAreaOrSubTabId?'
          component={(PatientProfileContainer as any)} />
        <Route exact path='/admin/:tabId?/:objectId?/:subTabId?/:questionId?'
          component={(AdminContainer as any)} />
      </Authentication>
    </Switch>
  </Main>
);
