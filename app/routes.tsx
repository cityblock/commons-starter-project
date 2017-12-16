import * as React from 'react';
import * as Loadable from 'react-loadable';
import { Redirect, Route, Switch } from 'react-router-dom';
import Authentication from './authentication-container/authentication-container';
import LogIn from './login-container/login-container';
import Main from './main-container/main-container';

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
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "notifications" */
              './event-notifications-container/event-notifications-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/tasks/:taskId?"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "tasks" */
              './tasks-container/tasks-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/settings"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "settings" */
              './settings-container/settings-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/search"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "search" */
              './patient-search-container/patient-search-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/patient-intake"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "search" */
              './patient-enrollment-container/patient-enrollment-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/patients"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "search" */
              './patient-panel-container/patient-panel-container'),
            loading: () => null,
          })}
        />
        <Route exact path="/patients/:patientId" component={PatientRedirect} />
        <Route
          path="/patients/:patientId/:tab"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "patient profile" */
              './patient-profile-container/patient-profile-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/builder/:tab?/:objectId?/:subTab?/:subTabId?"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "builder" */
              './builder-container/builder-container'),
            loading: () => null,
          })}
        />
        <Route
          exact
          path="/manager/:tabId?/:objectId?"
          component={(Loadable as any)({
            loader: async () =>
              import(/* webpackChunkName: "manager" */
              './manager-container/manager-container'),
            loading: () => null,
          })}
        />
      </Authentication>
    </Switch>
  </Main>
);
