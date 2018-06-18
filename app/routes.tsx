import React from 'react';
import Loadable from 'react-loadable';
import { Redirect, Route, Switch } from 'react-router-dom';
import Authentication from './authentication-container/authentication-container';
import Calendar from './calendar-container/calendar-container';
import Dashboard from './dashboard-container/dashboard-container';
import Main from './main-container/main-container';
import PatientPanel from './patient-panel-container/patient-panel-container';
import PatientProfile from './patient-profile-container/patient-profile-container';
import PatientSearch from './patient-search-container/patient-search-container';
import withTracker from './shared/with-tracker/with-tracker';
import Tasks from './tasks-container/tasks-container';

const PatientRedirect = (options: any) => (
  <Redirect to={`/patients/${options.match.params.patientId}/map/active`} />
);

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */
export default (
  <Main>
    <Switch>
      <Route
        exact
        path="/"
        component={(Loadable as any)({
          loader: async () =>
            import(/* webpackChunkName: "login" */ './login-container/login-container'),
          loading: () => null,
        })}
      />
      <Authentication>
        <Route path="/dashboard/:list/:answerId?" component={withTracker(Dashboard)} />
        <Route path="/tasks/:tab/:taskId?" component={withTracker(Tasks)} />
        <Route path="/calendar" component={withTracker(Calendar)} />
        <Route path="/search" component={withTracker(PatientSearch)} />
        <Route exact path="/patients/:patientId" component={PatientRedirect} />
        <Route exact path="/patients" component={withTracker(PatientPanel)} />
        <Route path="/patients/:patientId/:tab" component={withTracker(PatientProfile)} />
        <Route
          path="/settings"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "settings" */ './settings-container/settings-container'),
            loading: () => null,
          })}
        />
        <Route
          path="/builder/:tab?/:objectId?/:subTab?/:subTabId?"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "builder" */ './builder-container/builder-container'),
            loading: () => null,
          })}
        />
        <Route
          path="/manager/:tabId?/:objectId?"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "manager" */ './manager-container/manager-container'),
            loading: () => null,
          })}
        />
        <Route
          path="/contacts"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "contacts" */ './contacts-container/contacts-container'),
            loading: () => null,
          })}
        />
        <Route
          path="/voicemails/:voicemailId"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "voicemail" */ './voicemail-container/voicemail-container'),
            loading: () => null,
          })}
        />
      </Authentication>
    </Switch>
  </Main>
);
