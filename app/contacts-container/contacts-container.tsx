import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JwtForVcfCreate from '../graphql/queries/jwt-for-vcf-create.graphql';
import { JwtForVcfCreateMutation } from '../graphql/types';
import { getContactsVcfRoute } from '../shared/helpers/route-helpers';
import Button from '../shared/library/button/button';

interface IGraphqlProps {
  generateJwtForVcf: () => { data: JwtForVcfCreateMutation };
}
interface IState {
  loading: boolean;
  error: string | null;
}

export class ContactsContainer extends React.Component<IGraphqlProps, IState> {
  constructor(props: IGraphqlProps) {
    super(props);

    this.state = { loading: false, error: null };
  }

  handleClick = async (): Promise<void> => {
    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const jwtForVcf = await this.props.generateJwtForVcf();

        window.open(getContactsVcfRoute(jwtForVcf.data.JwtForVcfCreate.authToken));

        this.setState({ loading: false, error: null });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    return (
      <div>
        <Button messageId="contacts.download" onClick={this.handleClick} />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, {}, IGraphqlProps>(JwtForVcfCreate as any, {
  name: 'generateJwtForVcf',
})(ContactsContainer);
