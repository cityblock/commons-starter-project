import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './main-container/main-container';
import PokemonCreate from './main-container/pokemon-create';
import PokemonDetail from './main-container/pokemon-detail';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

export default (
  <MainContainer>
    <Switch>
      {/* <Route exact path="/" component={MainContainer} /> */}
      <Route exact path="/pokemon/:pokemonId" component={PokemonDetail} />
      <Route exact path="/" component={PokemonCreate} />
    </Switch>
  </MainContainer>
);
