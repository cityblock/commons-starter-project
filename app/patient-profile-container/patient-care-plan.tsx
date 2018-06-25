import classNames from 'classnames';
import React from 'react';
import { FullPatientConcern } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import TextDivider from '../shared/library/text-divider/text-divider';
import styles from './css/patient-care-plan.css';
import DnDPatientConcerns from './drag-and-drop/drag-and-drop-patient-concerns';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  selectedTaskId: string;
  selectedGoalId: string;
  activeConcerns: FullPatientConcern[];
  inactiveConcerns: FullPatientConcern[];
  taskIdsWithNotifications?: string[];
  isDragging?: boolean;
  glassBreakId: string | null;
  error?: string | null;
}

interface IState {
  selectedPatientConcernId: string;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  state = {
    selectedPatientConcernId: '',
  };

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.isDragging) {
      this.setState({
        selectedPatientConcernId: '',
      });
    }
  }

  onClickPatientConcern = (patientConcernId: string) => {
    const { selectedPatientConcernId } = this.state;

    if (patientConcernId === selectedPatientConcernId) {
      this.setState({ selectedPatientConcernId: '' });
    } else {
      this.setState({ selectedPatientConcernId: patientConcernId });
    }
  };

  render(): JSX.Element {
    const {
      loading,
      selectedTaskId,
      selectedGoalId,
      activeConcerns,
      inactiveConcerns,
      glassBreakId,
      error,
      taskIdsWithNotifications,
    } = this.props;

    if (loading) return <Spinner />;

    const { selectedPatientConcernId } = this.state;
    const carePlanStyles = classNames({
      [styles.error]: !!error,
    });

    return (
      <div className={carePlanStyles}>
        <DnDPatientConcerns
          concerns={activeConcerns}
          inactive={false}
          selectedPatientConcernId={selectedPatientConcernId}
          onClick={this.onClickPatientConcern}
          selectedTaskId={selectedTaskId}
          selectedGoalId={selectedGoalId}
          glassBreakId={glassBreakId}
          taskIdsWithNotifications={taskIdsWithNotifications}
        />
        <TextDivider messageId="patientMap.nextUp" hasPadding={true} />
        <DnDPatientConcerns
          concerns={inactiveConcerns}
          inactive={true}
          glassBreakId={glassBreakId}
          selectedPatientConcernId={selectedPatientConcernId}
          onClick={this.onClickPatientConcern}
          selectedTaskId={selectedTaskId}
          selectedGoalId={selectedGoalId}
          taskIdsWithNotifications={taskIdsWithNotifications}
        />
      </div>
    );
  }
}
