import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JwtForPdfCreate from '../graphql/queries/jwt-for-pdf-create.graphql';
import { JwtForPdfCreateMutation, JwtForPdfCreateMutationVariables } from '../graphql/types';
import { getPrintableMapPdfRoute } from '../shared/helpers/route-helpers';
import Button from '../shared/library/button/button';
import * as styles from './css/print-map-button.css';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  generateJwtForPdf: (
    options: { variables: JwtForPdfCreateMutationVariables },
  ) => { data: JwtForPdfCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class PrintMapButton extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { loading: false, error: null };
  }

  handleClick = async (): Promise<void> => {
    const { generateJwtForPdf, patientId } = this.props;

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const JwtForPdf = await generateJwtForPdf({ variables: { patientId } });

        const win = window.open(
          getPrintableMapPdfRoute(patientId, JwtForPdf.data.JwtForPdfCreate.authToken),
          '_blank',
        );

        if (win) {
          win.focus();
        }

        this.setState({ loading: false, error: null });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    return (
      <Button
        color="white"
        onClick={this.handleClick}
        messageId="patient.printMap"
        className={styles.button}
      />
    );
  }
}

export default graphql<any>(JwtForPdfCreate as any, {
  name: 'generateJwtForPdf',
})(PrintMapButton) as React.ComponentClass<IProps>;
