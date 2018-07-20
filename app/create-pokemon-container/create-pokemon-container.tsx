import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import pokemonCreateGraphql from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate, pokemonCreateVariables, PokeType } from '../graphql/types';
import styles from './css/create-pokemon-container.css';

interface IOptions {
  variables: pokemonCreateVariables;
}

interface IGraphqlProps {
  createPokemon: (options: IOptions) => { data: pokemonCreate; errors: ApolloError[] };
  loading?: boolean;
  error?: ApolloError | null;
}

type StateFields =
  | 'name'
  | 'pokemonNumber'
  | 'attack'
  | 'defense'
  | 'pokeType'
  | 'moves'
  | 'imageUrl';

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
// type IState = { [K in StateFields]: string };

class CreatePokemonContainer extends React.Component<IGraphqlProps, IState> {
  constructor(props: IGraphqlProps) {
    super(props);
    this.state = {
      name: '',
      pokemonNumber: 0,
      attack: 0,
      defense: 0,
      pokeType: 'bug' as PokeType,
      moves: [],
      imageUrl: '',
      error: null,
      loading: false,
    };
  }

  onChange(field: StateFields) {
    return (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({ [field as any]: e.target.value } as any);
    };
  }

  onSubmit = async () => {
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
        <label className={styles.formLabel}>
          Name
          <input name="name" value={this.state.name} onChange={this.onChange('name')} />
        </label>
        <br />
        <label className={styles.formLabel}>
          Pokemon Number
          <input
            name="pokemonNumber"
            value={this.state.pokemonNumber}
            onChange={this.onChange('pokemonNumber')}
          />
        </label>
        <br />
        <label className={styles.formLabel}>
          Attack
          <input name="attack" value={this.state.attack} onChange={this.onChange('attack')} />
        </label>
        <br />
        <label className={styles.formLabel}>
          Defense
          <input name="defense" value={this.state.defense} onChange={this.onChange('defense')} />
        </label>
        <br />
        <label className={styles.formLabel}>
          Poketype
          <select onChange={this.onChange('pokeType')}>
            <option value="" selected disabled>
              Please select a Poketype
            </option>
            <option value="normal" selected={false}>
              normal
            </option>
            <option value="grass" selected={false}>
              grass
            </option>
            <option value="fire" selected={false}>
              fire
            </option>
            <option value="water" selected={false}>
              water
            </option>
            <option value="electric" selected={false}>
              electric
            </option>
          </select>
        </label>
        <br />
        <label className={styles.formLabel}>
          Moves
          <input name="moves" value={this.state.moves} onChange={this.onChange('moves')} />
        </label>
        <br />
        <label className={styles.formLabel}>
          Image URL
          <input name="imageUrl" value={this.state.imageUrl} onChange={this.onChange('imageUrl')} />
        </label>
        <br />
        <button onClick={this.onSubmit}>Create!</button>
      </div>
    );
  }
}

// <IGraphqlProps, IOwnProps (aka passed down from parent to child), allProps>
export default graphql<IGraphqlProps, {}, IGraphqlProps>(pokemonCreateGraphql, {
  name: 'createPokemon',
})(CreatePokemonContainer);
