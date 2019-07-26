import { History } from 'history';
import toInteger from 'lodash/toInteger';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import pokemonCreateMutation from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate, pokemonCreateVariables, PokeType } from '../graphql/types';

interface IOptions {
  variables: pokemonCreateVariables
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  pokemonCreateGraphQL?: (options: IOptions) => { data: pokemonCreate }
}

interface IState {
  error: string;
  pokemon: pokemonCreateVariables;
}

type allProps = IGraphqlProps & IRouterProps;

class PokemonCreateContainer extends React.Component<allProps, IState> {
  state = {
    error: '',
    pokemon: {
      name: '',
      pokemonNumber: 0,
      attack: 0,
      defense: 0,
      pokeType: 'normal' as PokeType,
      moves: [],
      imageUrl: ''
    }
  }

  onChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (['pokemonNumber', 'attack', 'defense'].includes(name))
      value = toInteger(value) as any;

    this.onFieldUpdate({ name, value });
  }

  onFieldUpdate = ({ name, value }: { name: string, value: string | undefined }) => {
    const{ pokemon } = this.state;
    (pokemon as any)[name] = value;
    this.setState({ pokemon });
  }

  onSubmit = async () => {
    const { history, pokemonCreateGraphQL } = this.props;

    if (pokemonCreateGraphQL) {
      try {
        this.setState({ error: '' });
        const { data: { pokemonCreate: pokemon }, errors }: any = await pokemonCreateGraphQL({
          variables: this.state.pokemon
        });

        if (pokemon) {
          history.push(`/pokemon/${pokemon.id}`);
        } else {
          this.setState({ error: errors[0].message});
        }
      } catch (error) {
        this.setState({ error: `${error}` });
      }
    }
  }

  render() {
    const { pokemon, error } = this.state;

    return (
      <React.Fragment>
        <h1>New Pokemon</h1>
        <div>{error}</div>
        <div>
          Name: <input type="text" name="name" value={pokemon.name} onChange={this.onChange} />
        </div>
        <div>
          Number: <input type="number" name="pokemonNumber" value={pokemon.pokemonNumber} onChange={this.onChange} />
        </div>
        <div>
          Attack: <input type="number" name="attack" value={pokemon.attack} onChange={this.onChange} />
        </div>
        <div>
          Defense: <input type="number" name="defense" value={pokemon.defense} onChange={this.onChange} />
        </div>
        <div>
          Image URL: <input type="text" name="imageUrl" value={pokemon.imageUrl} onChange={this.onChange} />
        </div>
        <div>
          PokeType:
          <select id="pokeType" value={pokemon.pokeType} onChange={this.onChange} >
            {Object.values(PokeType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <input type="button" onClick={this.onSubmit} value="Create" />
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(pokemonCreateMutation, {
    name: 'pokemonCreateGraphQL',
    options: { refetchQueries: ['getAllPokemon'] }
  })
)(PokemonCreateContainer) as React.ComponentClass;
