import * as React from 'react';
import { graphql } from 'react-apollo';
import * as JWTForPDFQuery from '../../graphql/queries/get-jwt-for-pdf.graphql';
import { getJWTForPDFQuery } from '../../graphql/types';
import { getCBOReferralPDFRoute } from '../helpers/route-helpers';
import Button from '../library/button/button';
import * as styles from './css/task-cbo-referral-view.css';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  JWTForPDF: getJWTForPDFQuery['JWTForPDF'];
  loading?: boolean;
  error?: string | null;
}

type allProps = IProps & IGraphqlProps;

export class TaskCBOReferralView extends React.Component<allProps> {
  handleClick = (): void => {
    const { loading, error, JWTForPDF, taskId } = this.props;
    // do nothing if JWT token not available
    if (loading || error || !JWTForPDF) return;

    const win = window.open(getCBOReferralPDFRoute(taskId, JWTForPDF.authToken), '_blank');

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

export default graphql<IGraphqlProps, IProps, allProps>(JWTForPDFQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : false,
    JWTForPDF: data ? data.JWTForPDF : null,
  }),
})(TaskCBOReferralView);
