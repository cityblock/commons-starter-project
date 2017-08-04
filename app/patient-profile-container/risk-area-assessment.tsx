import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as riskAreaQuery from '../graphql/queries/get-risk-area.graphql';
import { FullRiskAreaFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/risk-areas.css';

export interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  redirectToThreeSixty?: () => any;
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string;
}

class RiskAreaAssessment extends React.Component<IProps, {}> {
  componentWillReceiveProps(nextProps: IProps) {
    const { error, redirectToThreeSixty } = nextProps;

    // The chosen RiskArea most likely does not exist
    if (error && redirectToThreeSixty) {
      redirectToThreeSixty();
    }
  }

  render() {
    const { riskArea } = this.props;
    const text = riskArea ? riskArea.title : 'Loading...';

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={styles.buttons}>
            <div className={classNames(styles.invertedButton, styles.cancelButton)}>Cancel</div>
            <div className={classNames(styles.button, styles.saveButton)}>Save updates</div>
          </div>
        </div>
        <div className={styles.riskAreasPanel}>
          <div className={styles.riskAssessment}>{text}</div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToThreeSixty: () => {
      dispatch(push(ownProps.routeBase));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      riskArea: (data ? (data as any).riskArea : null),
    }),
  }),
)(RiskAreaAssessment);
