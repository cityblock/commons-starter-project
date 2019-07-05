import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import pokemomCreateGraphql from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate, pokemonCreateVariables } from '../graphql/types';
import { IUpdatedField } from '../shared/util/updated-fields';

interface IOptions {
  variables: pokemonCreateVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  createPokemon?: (options: IOptions) => { data: pokemonCreate };
}

interface IState {
  loading: boolean;
  pokemon: pokemonCreateVariables;
}

type allProps = IProps & IGraphqlProps & IRouterProps;

export class PokemonCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      pokemon: {
        name: '',
        attack: 0,
        defense: 0,
        pokemonNumber: 200,
        pokeType: '',
        moves: ['Slash', 'Flame Wheel'],
        imageUrl: 'test.png',
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { pokemon } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (pokemon as any)[fieldName] = fieldValue;

    this.setState({ pokemon });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({ [fieldName as any]: fieldValue } as any);

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit() {
    const { history, routeBase } = this.props;

    if (this.props.createPokemon) {
      try {
        this.setState({ loading: true });

        // Add the pokemon by calling the graphQL
        const pokemon = await this.props.createPokemon({
          variables: {
            ...this.state.pokemon,
          },
        });

        this.setState({ loading: false });

        // If success, redirect to the newly created pokemon
        if (pokemon.data.pokemonCreate) {
          history.push(`${routeBase}/${pokemon.data.pokemonCreate.id}`);
        }
      } catch (err) {
        this.setState({ loading: false });
      }
    }
    return false;
  }

  render() {
    const { pokemon } = this.state;

    return (
      <div>
        <input
          type="text"
          name="pokemonNumber"
          value={pokemon.pokemonNumber}
          onChange={this.onChange}
        />
        <input type="text" name="name" value={pokemon.name} onChange={this.onChange} />
        <input type="text" name="attack" value={pokemon.attack} onChange={this.onChange} />
        <input type="text" name="defense" value={pokemon.defense} onChange={this.onChange} />
        <input type="text" name="pokeType" value={pokemon.pokeType} onChange={this.onChange} />
        <input type="button" onClick={this.onSubmit} value="Add" />
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(pokemomCreateGraphql, {
    name: 'createPokemon',
    options: {
      refetchQueries: ['pokemons'],
    },
  }),
)(PokemonCreate) as React.ComponentClass<IProps>;
