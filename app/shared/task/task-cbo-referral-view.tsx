import React from 'react';
import { graphql } from 'react-apollo';
import JwtForPdfCreateGraphql from '../../graphql/queries/jwt-for-pdf-create.graphql';
import { JwtForPdfCreate, JwtForPdfCreateVariables } from '../../graphql/types';
import { getCBOReferralPdfRoute } from '../helpers/route-helpers';
import Button from '../library/button/button';
import styles from './css/task-cbo-referral-view.css';

interface IProps {
  taskId: string;
  patientId: string;
}

interface IGraphqlProps {
  generateJwtForPdf: (
    options: { variables: JwtForPdfCreateVariables },
  ) => { data: JwtForPdfCreate };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class TaskCBOReferralView extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  handleClick = async (): Promise<void> => {
    const { generateJwtForPdf, taskId, patientId } = this.props;

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const JwtForPdf = await generateJwtForPdf({ variables: { patientId } });

        const win = window.open(
          getCBOReferralPdfRoute(taskId, JwtForPdf.data.JwtForPdfCreate.authToken),
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
        className={styles.button}
        onClick={this.handleClick}
        messageId="CBO.viewForm"
        icon="pictureAsPDF"
      />
    );
  }
}

export default graphql<any>(JwtForPdfCreateGraphql, {
  name: 'generateJwtForPdf',
})(TaskCBOReferralView) as React.ComponentClass<IProps>;
