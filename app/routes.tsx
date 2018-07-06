import React from 'react';
import { Route, Switch } from 'react-router-dom';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

const TestComponent: React.StatelessComponent = () => {
  return <div>Hi Starter Project!</div>;
};

export default (
  <Switch>
    <Route exact path="/" component={TestComponent} />
  </Switch>
);
