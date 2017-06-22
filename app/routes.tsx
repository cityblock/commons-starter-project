import * as React from 'react';
import { Route } from 'react-router-dom';
import Authentication from './containers/authentication-container';
import LogIn from './containers/login-container';
import Main from './containers/main';
import PatientEnrollmentContainer from './containers/patient-enrollment';
import PatientPanelContainer from './containers/patient-panel-container';
import PatientProfileContainer from './containers/patient-profile';

export default (
  <Main>
    <Route exact path='/' component={(LogIn as any)} />
    <Route path={'/patient*'} render={() => (
      <Authentication>
        <Route exact path='/patient/new' component={(PatientEnrollmentContainer as any)} />
        <Route exact path='/patients' component={(PatientPanelContainer as any)} />
        <Route exact path='/patients/:patientId' component={(PatientProfileContainer as any)} />
      </Authentication>
    )} />
  </Main>
);
