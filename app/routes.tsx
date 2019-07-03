import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './main-container/main-container';
import PokeAdd from './pokeadd-container/pokeadd-container';
import PokeDetail from './pokedetail-container/pokedetail-container';

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
      <Route exact path="/" component={PokeAdd} />
      <Route exact path="/pokemon/:pokemonId" component={PokeDetail} />
    </MainContainer>
  </Switch>
);
