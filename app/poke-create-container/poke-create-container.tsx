import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import pokemomCreateGraphql from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate, pokemonCreateVariables, PokeType } from '../graphql/types';
import { ToArray } from '../shared/util/helpers';
import { IUpdatedField } from '../shared/util/updated-fields';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';

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
  error: string;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps & IRouterProps;

const content = {
  position: 'relative' as 'relative',
  marginLeft: '50vw',
  padding: '10px',
};

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
        pokeType: PokeType.dragon,
        moves: ['Slash', 'Flame Wheel'],
        imageUrl: 'test.png',
      },
      error: '',
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
    this.setState({ error: '' });

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
        } else {
          const error = pokemon.errors[0].message;
          this.setState({ error });
        }
      } catch (err) {
        this.setState({ loading: false });
      }
    }
    return false;
  }

  render() {
    const { pokemon, error } = this.state;

    const pokeTypeList = ToArray(PokeType);

    return (
      <div style={content}>
        <h1>New Pokemon</h1>
        <div>{error}</div>
        <div>
          number >
          <input
            type="text"
            name="pokemonNumber"
            value={pokemon.pokemonNumber}
            onChange={this.onChange}
          />
        </div>
        <div>
          name > <input type="text" name="name" value={pokemon.name} onChange={this.onChange} />
        </div>
        <div>
          attach >
          <input type="text" name="attack" value={pokemon.attack} onChange={this.onChange} />
        </div>
        <div>
          defense >
          <input type="text" name="defense" value={pokemon.defense} onChange={this.onChange} />
        </div>
        <div>
          poketype >
          <select id="pokeType" value={pokemon.pokeType} onChange={this.onChange}>
            {pokeTypeList.map(x => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input type="button" onClick={this.onSubmit} value="Add" />
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withErrorHandler(),
  graphql(pokemomCreateGraphql, {
    name: 'createPokemon',
    options: {
      refetchQueries: ['pokemons'],
    },
  }),
)(PokemonCreate) as React.ComponentClass<IProps>;
