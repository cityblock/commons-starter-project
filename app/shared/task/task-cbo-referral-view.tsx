import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JWTForPDFCreate from '../../graphql/queries/jwt-for-pdf-create.graphql';
import { JWTForPDFCreateMutation } from '../../graphql/types';
import { getCBOReferralPDFRoute } from '../helpers/route-helpers';
import Button from '../library/button/button';
import * as styles from './css/task-cbo-referral-view.css';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  generateJWTForPDF: () => { data: JWTForPDFCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export class TaskCBOReferralView extends React.Component<allProps> {
  handleClick = async (): Promise<void> => {
    const { generateJWTForPDF, taskId } = this.props;
    const JWTForPDF = await generateJWTForPDF();

    const win = window.open(
      getCBOReferralPDFRoute(taskId, JWTForPDF.data.JWTForPDFCreate.authToken),
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
        className={styles.button}
        onClick={this.handleClick}
        messageId="CBO.viewForm"
        icon="pictureAsPDF"
      />
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(JWTForPDFCreate as any, {
  name: 'generateJWTForPDF',
})(TaskCBOReferralView);
