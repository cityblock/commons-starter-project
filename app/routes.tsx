import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Authentication from './containers/authentication-container';
import LogIn from './containers/login-container';
import Main from './containers/main';
import PatientEnrollmentContainer from './containers/patient-enrollment';
import PatientPanelContainer from './containers/patient-panel-container';
import PatientProfileContainer from './containers/patient-profile';
import SettingsContainer from './containers/settings';
import TasksContainer from './containers/tasks-container';

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
        <Route exact path='/tasks/:taskId' component={(TasksContainer as any)} />
        <Route exact path='/tasks' component={(TasksContainer as any)} />
        <Route exact path='/settings' component={(SettingsContainer as any)} />
        <Route exact path='/patient-intake' component={(PatientEnrollmentContainer as any)} />
        <Route exact path='/patients' component={(PatientPanelContainer as any)} />
        <Route exact path='/patients/:patientId' component={(PatientRedirect as any)} />
        <Route path='/patients/:patientId/:tabId' component={(PatientProfileContainer as any)} />
      </Authentication>
    </Switch>
  </Main>
);
