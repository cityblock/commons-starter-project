import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './main-container/main-container';
import PokeCreate from './poke-create-container/poke-create-container';
import PokeDetail from './poke-detail-container/poke-detail-container';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

export default (
  <Switch>
    <MainContainer>
      <Route exact path="/" component={PokeCreate} />
      <Route exact path="/pokemon/:pokemonId" component={PokeDetail} />
    </MainContainer>
  </Switch>
);
