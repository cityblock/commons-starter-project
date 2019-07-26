import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './main-container/main-container';
import PokemonCreateContainer from './pokemon-create-container/pokemon-create-container';
import PokemonDetailContainer from './pokemon-detail-container/pokemon-detail-container';

export default (
  <MainContainer>
    <Switch>
      <Route exact path="/" component={PokemonCreateContainer} />
      <Route exact path="/pokemon/:pokemonId" component={PokemonDetailContainer} />
    </Switch>
  </MainContainer>
);
