import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PokemonList from './pokemon-list/pokemon-list';
import CreatePokemonForm from './create-pokemon-form/create-pokemon-form';

/**
 * What is <Switch>?
 * <Switch> makes the router behave like a normal router and render the first matched route
 * instead of all matched routes.
 *
 * NOTE: We async load infrequently used and admin routes
 */

export default (
  <Switch>
    <Route exact path="/" component={PokemonList} />
    <Route exact path="/add-pokemon" component={CreatePokemonForm} />
  </Switch>
);
