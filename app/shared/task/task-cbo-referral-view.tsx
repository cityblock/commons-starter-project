import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JwtForPdfCreate from '../../graphql/queries/jwt-for-pdf-create.graphql';
import { JwtForPdfCreateMutation } from '../../graphql/types';
import { getCBOReferralPdfRoute } from '../helpers/route-helpers';
import Button from '../library/button/button';
import * as styles from './css/task-cbo-referral-view.css';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  generateJwtForPdf: () => { data: JwtForPdfCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export class TaskCBOReferralView extends React.Component<allProps> {
  handleClick = async (): Promise<void> => {
    const { generateJwtForPdf, taskId } = this.props;
    const JwtForPdf = await generateJwtForPdf();

    const win = window.open(
      getCBOReferralPdfRoute(taskId, JwtForPdf.data.JwtForPdfCreate.authToken),
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

export default graphql<IGraphqlProps, IProps, allProps>(JwtForPdfCreate as any, {
  name: 'generateJwtForPdf',
})(TaskCBOReferralView);
