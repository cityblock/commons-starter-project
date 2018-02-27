import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JwtForPdfCreate from '../graphql/queries/jwt-for-pdf-create.graphql';
import { JwtForPdfCreateMutation } from '../graphql/types';
import { getPrintableMapPdfRoute } from '../shared/helpers/route-helpers';
import Button from '../shared/library/button/button';
import * as styles from './css/print-map-button.css';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  generateJwtForPdf: () => { data: JwtForPdfCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export class PrintMapButton extends React.Component<allProps> {
  handleClick = async (): Promise<void> => {
    const { generateJwtForPdf, patientId } = this.props;
    const JwtForPdf = await generateJwtForPdf();

    const win = window.open(
      getPrintableMapPdfRoute(patientId, JwtForPdf.data.JwtForPdfCreate.authToken),
      '_blank',
    );

    if (win) {
      win.focus();
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

export default graphql<IGraphqlProps, IProps, allProps>(JwtForPdfCreate as any, {
  name: 'generateJwtForPdf',
})(PrintMapButton);
