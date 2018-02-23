import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { closePopup as closePopupAction, openPopup } from '../actions/popup-action';
import Button from '../shared/library/button/button';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import { IState as IAppState } from '../store';
import * as styles from './css/patient-care-plan.css';
import PatientCarePlanSuggestions from './patient-care-plan-suggestions';
import PatientMap from './patient-map';

type SelectableTabs = 'active' | 'suggestions';

interface IProps {
  match: {
    params: {
      patientId: string;
      subTab?: SelectableTabs;
      taskId?: string;
    };
  };
  glassBreakId: string | null;
}

interface IStateProps {
  isPopupOpen: boolean;
}

interface IDispatchProps {
  addConcern: () => void;
  closePopup: () => void;
}

export type allProps = IProps & IStateProps & IDispatchProps;

export class PatientCarePlanView extends React.Component<allProps> {
  onContainerClick = () => {
    const { isPopupOpen, closePopup } = this.props;
    if (isPopupOpen) closePopup(); // only dispatch action if needed
  };

  render(): JSX.Element {
    const { match, addConcern, glassBreakId } = this.props;
    const patientId = match.params.patientId;
    const subTab = match.params.subTab;
    const routeBase = `/patients/${match.params.patientId}/map`;
    const taskId = match.params.taskId;
    const isSuggestions = subTab === 'suggestions';

    const carePlanSuggestions = isSuggestions ? (
      <PatientCarePlanSuggestions
        routeBase={routeBase}
        patientId={patientId}
        glassBreakId={glassBreakId}
      />
    ) : null;
    const carePlan = !isSuggestions ? (
      <PatientMap
        routeBase={`${routeBase}/active`}
        patientId={patientId}
        taskId={taskId || null}
        glassBreakId={glassBreakId}
      />
    ) : null;

    return (
      <div onClick={this.onContainerClick}>
        <UnderlineTabs>
          <div>
            <UnderlineTab
              messageId="patient.activeCarePlan"
              href={`${routeBase}/active`}
              selected={!isSuggestions}
            />
            <UnderlineTab
              messageId="patient.carePlanSuggestions"
              href={`${routeBase}/suggestions`}
              selected={isSuggestions}
            />
          </div>
          {!isSuggestions && (
            <div>
              <Button messageId="concernCreate.addConcern" onClick={addConcern} />
            </div>
          )}
        </UnderlineTabs>
        <div className={styles.carePlanPanel}>
          {carePlanSuggestions}
          {carePlan}
        </div>
      </div>
    );
  }
}

const getPatientId = (props: IProps): string => props.match.params.patientId;

const mapStateToProps = (state: IAppState): IStateProps => {
  const isPopupOpen = !!state.popup.name;
  return { isPopupOpen };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => {
  const addConcern = () =>
    dispatch(
      openPopup({
        name: 'CREATE_PATIENT_CONCERN',
        options: { patientId: getPatientId(ownProps) },
      }),
    );

  return {
    addConcern,
    closePopup: () => dispatch(closePopupAction()),
  };
};

export default connect<IStateProps, IDispatchProps, IProps>(
  mapStateToProps as (args?: any) => IStateProps,
  mapDispatchToProps,
)(PatientCarePlanView);
