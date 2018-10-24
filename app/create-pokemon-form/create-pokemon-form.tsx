import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import pokemonCreateGraphql from '../graphql/queries/create-pokemon.graphql';
import { pokemonCreate, pokemonCreateVariables, PokeType } from '../graphql/types';
import styles from './css/create-pokemon-form.css';

interface IOptions {
  variables: pokemonCreateVariables;
}

interface IGraphqlProps {
  createPokemon: (options: IOptions) => { data: pokemonCreate };
  loading?: boolean;
  error?: ApolloError | null;
}

interface IState {
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
  error: string | null;
  loading: boolean;
}

type createPokemonFields =
  | 'name'
  | 'pokemonNumber'
  | 'attack'
  | 'defense'
  | 'pokeType'
  | 'moves'
  | 'imageUrl';

class CreatePokemonForm extends React.Component<IGraphqlProps, IState> {
  constructor(props: IGraphqlProps) {
    super(props);
    this.state = {
      name: '',
      pokemonNumber: 0,
      attack: 0,
      defense: 0,
      pokeType: 'electric' as PokeType,
      moves: [],
      imageUrl: '',
      error: null,
      loading: false,
    };
  }

  handleChange(field: createPokemonFields) {
    return (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({ [field as any]: e.target.value } as any);
    };
  }

  handleSubmit = async () => {
    const { createPokemon } = this.props;

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        await createPokemon({
          variables: {
            name: this.state.name,
            pokemonNumber: this.state.pokemonNumber,
            attack: this.state.attack,
            defense: this.state.defense,
            pokeType: this.state.pokeType,
            moves: this.state.moves,
            imageUrl: this.state.imageUrl,
          },
        });
        this.setState({ loading: false, error: null });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Create a new Pokemon!</h1>
        <p>{this.state.error}</p>
        <label>
          Name
          <input name="name" value={this.state.name} onChange={this.handleChange('name')} />
        </label>
        <br />
        <label>
          Pokemon Number
          <input
            name="pokemonNumber"
            value={this.state.pokemonNumber}
            onChange={this.handleChange('pokemonNumber')}
          />
        </label>
        <br />
        <label>
          Attack
          <input name="attack" value={this.state.attack} onChange={this.handleChange('attack')} />
        </label>
        <br />
        <label>
          Defense
          <input
            name="defense"
            value={this.state.defense}
            onChange={this.handleChange('defense')}
          />
        </label>
        <br />
        <label>Poketype</label>
        <input
          name="pokeType"
          value={this.state.pokeType}
          onChange={this.handleChange('pokeType')}
        />
        <br />
        <label>
          Moves
          <input name="moves" value={this.state.moves} onChange={this.handleChange('moves')} />
        </label>
        <br />
        <label>
          Image URL
          <input
            name="imageUrl"
            value={this.state.imageUrl}
            onChange={this.handleChange('imageUrl')}
          />
        </label>
        <br />
        <button onClick={this.handleSubmit}>Create!</button>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, {}, IGraphqlProps>(pokemonCreateGraphql, {
  name: 'createPokemon',
})(CreatePokemonForm);

export { CreatePokemonForm };
