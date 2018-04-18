import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Authentication from './authentication-container/authentication-container';
import Builder from './builder-container/builder-container';
import Contacts from './contacts-container/contacts-container';
import Dashboard from './dashboard-container/dashboard-container';
import LogIn from './login-container/login-container';
import Main from './main-container/main-container';
import Manager from './manager-container/manager-container';
import PatientPanel from './patient-panel-container/patient-panel-container';
import PatientProfile from './patient-profile-container/patient-profile-container';
import PatientSearch from './patient-search-container/patient-search-container';
import Settings from './settings-container/settings-container';
import Tasks from './tasks-container/tasks-container';

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
        <Route path="/dashboard/:list/:answerId?" component={Dashboard} />
        <Route path="/tasks/:taskId?" component={Tasks} />
        <Route path="/settings" component={Settings} />
        <Route path="/search" component={PatientSearch} />
        <Route exact path="/patients/:patientId" component={PatientRedirect} />
        <Route exact path="/patients" component={PatientPanel} />
        <Route path="/patients/:patientId/:tab" component={PatientProfile} />
        <Route path="/builder/:tab?/:objectId?/:subTab?/:subTabId?" component={Builder} />
        <Route path="/manager/:tabId?/:objectId?" component={Manager} />
        <Route path="/contacts" component={Contacts} />
      </Authentication>
    </Switch>
  </Main>
);
