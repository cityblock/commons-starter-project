import React from 'react';
import { graphql } from 'react-apollo';
import pokemonCreateGraphql from '../graphql/queries/pokemon-create-mutation.graphql';
import { pokemonCreate, pokemonCreateVariables } from '../graphql/types';

interface IOptions {
  variables: pokemonCreateVariables;
}

interface IGraphqlProps {
  createPokemon: (options: IOptions) => { data: pokemonCreate };
}

type StateFields = 'name';

// interface IState {
//   name: string;
// }
type IState = { [K in StateFields]: string };

class CreatePokemonContainer extends React.Component<IGraphqlProps, IState> {
  constructor(props: IGraphqlProps) {
    super(props);
    this.state = {
      name: '',
    };
  }

  onChange(field: StateFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ [field]: e.target.value });
    };
  }

  onSubmit = async () => {
    const { createPokemon } = this.props;

    const pokemon = await createPokemon({
      variables: {
        name: this.state.name,
      },
    });
  };

  // async onSubmit() {
  //   const { history, routeBase, openErrorPopup } = this.props;
  //   if (!this.state.loading) {
  //     try {
  //       this.setState({ loading: true, error: null });
  //       const concern = await this.props.createConcern({
  //         variables: {
  //           ...this.state.concern,
  //         },
  //       });
  //       this.setState({ loading: false });

  //     } catch (err) {
  //       this.setState({ loading: false, error: err.message });

  //     }
  //   }

  // }

  render() {
    return (
      <div>
        <h1>Your Project here!</h1>
        <input name="name" value={this.state.name} onChange={this.onChange('name')} />
        <button onClick={this.onSubmit}>Create!</button>
      </div>
    );
  }
}

// <IGraphqlProps, IOwnProps, allProps>
export default graphql<IGraphqlProps, {}, IGraphqlProps>(pokemonCreateGraphql, {
  name: 'createPokemon',
  options: { refetchQueries: ['getAllPokemon'] },
})(CreatePokemonContainer);

// export default compose(
//   withRouter,
//   withErrorHandler(),
//   graphql(concernCreateGraphql, {
//     name: 'createConcern',
//     options: {
//       refetchQueries: ['getConcerns'],
//     },
//   }),
// )(ConcernCreate) as React.ComponentClass<IProps>;
