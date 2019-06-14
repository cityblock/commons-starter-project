import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { pokemonCreate } from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate_pokemonCreate } from '../graphql/types';
import styles from './css/pokemon-create.css';

interface IOptions {
  variables: pokemonCreate_pokemonCreate;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
}

interface IGraphqlProps {
  pokemonCreate?: (
    options: IOptions,
  ) => { data: pokemonCreate_pokemonCreate; errors?: ApolloError[] };
}

interface IRouterProps {
  history: History;
}

interface IState {
  loading: boolean;
  pokemonToCreate: pokemonCreate_pokemonCreate;
}

type allProps = IProps & IGraphqlProps & IRouterProps;

export class PokemonCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      pokemonToCreate: {
        pokemonNumber: 0,
        id: '',
        name: '',
        attack: 0,
        defense: 0,
        pokeType: '',
        moves: [],
        imageUrl: '',
      },
    };
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const { pokemonToCreate } = this.state;
    (pokemonToCreate as any)[fieldName] = fieldValue;
    this.setState({ pokemonToCreate });
  }

  async onSubmit() {
    // const { routeBase } = this.props;
    if (this.props.pokemonCreate) {
      try {
        console.log('hi!!!');
        this.setState({ loading: true });
        const result = await this.props.pokemonCreate({
          variables: {
            ...this.state.pokemonToCreate,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        // if (result.data) {
        //   history.push(`${routeBase}/${result.data.id}`);
        // }
        if (result.errors) {
          console.log(JSON.stringify(result.errors));
        }
      } catch (err) {
        this.setState({ loading: false });
      }
    }
    return false;
  }

  render() {
    const { pokemonToCreate } = this.state;

    return (
      <form onSubmit={this.onSubmit} className={styles.container}>
        <label>
          <p>
            Name:{' '}
            <input type="text" name="name" value={pokemonToCreate.name} onChange={this.onChange} />
          </p>
          <p>
            Pokemon Number: <input type="number" name="pokemonNumber" />
          </p>
          <p>
            Attack: <input type="number" name="attack" />
          </p>
          <p>
            Defense: <input type="number" name="defense" />
          </p>
          <p>
            Poketype: <input type="text" name="poketype" />
          </p>
          <p>
            Moves: <input type="text" name="name" />
          </p>
          <p>
            Image URL: <input type="text" name="imageURL" />
          </p>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default compose(
  withRouter,
  graphql(pokemonCreate, {
    name: 'createPokemon',
    options: {
      refetchQueries: ['getPokemons'],
    },
  }),
)(PokemonCreate) as React.ComponentClass<IProps>;
