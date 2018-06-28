import React from 'react';
import { compose } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { closePopup as closePopupAction } from '../../actions/popup-action';
import { FullCarePlanSuggestion } from '../../graphql/types';
import { ICarePlanSuggestionsPopupOptions } from '../../reducers/popup-reducer';
import { IState as IAppState } from '../../store';
import Modal from '../library/modal/modal';
import Text from '../library/text/text';
import { getConcernCount, getGoalCount, getTaskCount } from '../util/care-plan-count';
import styles from './css/care-plan-suggestions.css';

interface IStateProps {
  isVisible: boolean;
  patientId: string;
  carePlanSuggestions: FullCarePlanSuggestion[];
}

interface IDispatchProps {
  closePopup: () => void;
}

type allProps = IStateProps & IDispatchProps & RouteComponentProps<IStateProps & IDispatchProps>;

export class CarePlanSuggestions extends React.Component<allProps> {
  handleClick = (): void => {
    const { history, patientId, closePopup } = this.props;
    history.push(`/patients/${patientId}/map/suggestions`);
    closePopup();
  };

  render() {
    const { carePlanSuggestions, closePopup, isVisible } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        isLoading={false}
        titleMessageId="suggestionsModal.title"
        subTitleMessageId="suggestionsModal.body"
        onSubmit={closePopup}
        onClose={closePopup}
        onCancel={this.handleClick}
        submitMessageId="suggestionsModal.done"
        cancelMessageId="suggestionsModal.seeSuggestions"
      >
        <div className={styles.container}>
          <div className={styles.count}>
            <Text messageId="suggestionsModal.concerns" color="darkGray" size="large" />
            <Text
              text={`${getConcernCount(carePlanSuggestions)}`}
              isBold
              color="black"
              size="large"
            />
          </div>
          <div className={styles.count}>
            <Text messageId="suggestionsModal.goals" color="darkGray" size="large" />
            <Text text={`${getGoalCount(carePlanSuggestions)}`} isBold color="black" size="large" />
          </div>
          <div className={styles.count}>
            <Text messageId="suggestionsModal.tasks" color="darkGray" size="large" />
            <Text text={`${getTaskCount(carePlanSuggestions)}`} isBold color="black" size="large" />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const isVisible = state.popup.name === 'CARE_PLAN_SUGGESTIONS';
  const patientId = isVisible
    ? (state.popup.options as ICarePlanSuggestionsPopupOptions).patientId
    : '';
  const carePlanSuggestions = isVisible
    ? (state.popup.options as ICarePlanSuggestionsPopupOptions).carePlanSuggestions
    : [];

  return {
    isVisible,
    patientId,
    carePlanSuggestions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => ({
  closePopup: () => dispatch(closePopupAction()),
});

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
)(CarePlanSuggestions);
