import { fullPokemon } from 'app/graphql/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import pokemonsGraphql from '../graphql/queries/pokemon-getall-query.graphql';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  pokemons: fullPokemon[] | null;
}

type allProps = IProps & IGraphqlProps;

const leftCol = {
  position: 'fixed' as 'fixed',
  width: '50vw',
  backgroundColor: '#DDD',
  top: 0,
  bottom: 0,
};

const styleSpan = {
  padding: '10px',
};

const styleDivImage = {
  width: '100%',
};

const styleImage = {
  display: 'block',
  width: '30%',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: 10,
};

const style = {
  width: '10%',
};

export const PokeList: React.StatelessComponent<allProps> = (props: allProps) => {
  const { pokemons } = props;

  if (!pokemons) return null;

  return (
    <div style={leftCol}>
      <div style={styleDivImage}>
        <Link to={`/`}>
          <img src="/assets/pokemon-logo.png" style={styleImage} alt="pokemon" />
        </Link>
      </div>
      {pokemons.map((item: fullPokemon) => (
        <span key={item.id} style={styleSpan}>
          <Link to={`/pokemon/${item.id}`}>
            <img
              id={`${item.name}`}
              className="pokeImg"
              src={`${item.imageUrl}`}
              style={style}
              alt={item.name || ''}
            />
          </Link>
        </span>
      ))}
    </div>
  );
};

export default compose(
  graphql(pokemonsGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      pokemons: data ? (data as any).pokemons : null,
    }),
  }),
)(PokeList) as React.ComponentClass<IProps>;
