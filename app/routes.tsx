import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AllPokemonContainer from './all-pokemon-container/all-pokemon-container';
import CreatePokemonContainer from './create-pokemon-container/create-pokemon-container';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

export default (
  <AllPokemonContainer>
    <Switch>
      <Route exact path="/" component={CreatePokemonContainer} />
    </Switch>
  </AllPokemonContainer>
);
