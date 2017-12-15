import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as screeningToolsQuery from '../../graphql/queries/get-screening-tools-for-risk-area.graphql';
/* tslint:enable:max-line-length */
import { getScreeningToolsQuery, FullScreeningToolFragment } from '../../graphql/types';
import Button from '../../shared/library/button/button';
import * as styles from './css/screening-tools-popup.css';

interface IProps {
  screeningToolsLoading?: boolean;
  onDismiss: () => any;
  patientRoute: string;
  riskAreaId: string;
}

interface IGraphqlProps {
  screeningTools?: getScreeningToolsQuery['screeningTools'];
  screeningToolsLoading?: boolean;
  screeningToolsError?: string | null;
}

interface IDispatchProps {
  redirectToScreeningTool: (screeningTool: FullScreeningToolFragment) => any;
}

type allProps = IGraphqlProps & IProps & IDispatchProps;

class ScreeningToolsPopup extends React.Component<allProps> {
  renderScreeningTools() {
    const { screeningTools, screeningToolsLoading, redirectToScreeningTool } = this.props;

    if (screeningToolsLoading) {
      return <div className={styles.screeningToolOptionsLoading}>Loading...</div>;
    }

    if (!screeningTools || !screeningTools.length) {
      return (
        <div className={styles.emptyScreeningToolOptions}>
          No screening tools for this assessment
        </div>
      );
    }

    return screeningTools.map(screeningTool => {
      if (screeningTool) {
        return (
          <div
            key={screeningTool.id}
            className={styles.screeningToolOption}
            onClick={() => redirectToScreeningTool(screeningTool)}
          >
            <div className={styles.screeningToolOptionText}>{screeningTool.title}</div>
          </div>
        );
      }
    });
  }

  render() {
    const { onDismiss } = this.props;
    return (
      <div className={styles.screeningToolsPopupContent}>
        <div className={styles.screeningToolsPopupHeader}>
          <Button icon="close" onClick={onDismiss} />
        </div>
        <div className={styles.screeningToolsPopupBody}>
          <div className={classNames(styles.screeningToolsPopupTitle, styles.noMargin)}>
            Select a tool
          </div>
          <div className={styles.screeningToolOptions}>{this.renderScreeningTools()}</div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToScreeningTool: (screeningTool: FullScreeningToolFragment) => {
      dispatch(push(`${ownProps.patientRoute}/tools/${screeningTool.id}`));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, allProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningToolsForRiskArea : null,
    }),
  }),
)(ScreeningToolsPopup);
