import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { closePopup } from '../../actions/popup-action';
import * as screeningToolsQuery from '../../graphql/queries/get-screening-tools.graphql';
import { getScreeningToolsQuery, FullScreeningToolFragment } from '../../graphql/types';
import { IScreeningToolPopupOptions } from '../../reducers/popup-reducer';
import { getPatientRoute } from '../../shared/helpers/route-helpers';
import Button from '../../shared/library/button/button';
import { Popup } from '../../shared/popup/popup';
import { IState as IAppState } from '../../store';
import * as styles from './css/screening-tools-popup.css';

interface IProps {
  history: History;
}

interface IStateProps {
  isVisible: boolean;
  patientRoute: string | null;
}

interface IDispatchProps {
  onDismiss: () => void;
}

interface IGraphqlProps {
  screeningTools?: getScreeningToolsQuery['screeningTools'];
  screeningToolsLoading?: boolean;
  screeningToolsError?: string | null;
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps;

class ScreeningToolsPopup extends React.Component<allProps> {
  renderScreeningTools() {
    const { screeningTools, screeningToolsLoading, history, patientRoute, onDismiss } = this.props;

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

    const redirectToScreeningTool = (screeningTool: FullScreeningToolFragment) => {
      if (patientRoute) {
        history.push(`${patientRoute}/tools/${screeningTool.id}`);
        onDismiss();
      }
    };

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
    const { onDismiss, isVisible } = this.props;

    return (
      <Popup visible={isVisible} style={'small-padding'} closePopup={onDismiss}>
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
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const isVisible = state.popup.name === 'SCREENING_TOOL';
  const patientId = isVisible ? (state.popup.options as IScreeningToolPopupOptions).patientId : '';

  const patientRoute = patientId ? getPatientRoute(patientId) : null;

  return { isVisible, patientRoute };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  const onDismiss = () => dispatch(closePopup());

  return { onDismiss };
};

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(ScreeningToolsPopup) as React.ComponentClass<{}>;
