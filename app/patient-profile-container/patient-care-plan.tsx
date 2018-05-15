import * as classNames from 'classnames';
import * as React from 'react';
import { FullPatientConcernFragment } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import TextDivider from '../shared/library/text-divider/text-divider';
import * as styles from './css/patient-care-plan.css';
import DnDPatientConcerns from './drag-and-drop/drag-and-drop-patient-concerns';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  selectedTaskId: string;
  selectedGoalId: string;
  activeConcerns: FullPatientConcernFragment[];
  inactiveConcerns: FullPatientConcernFragment[];
  taskIdsWithNotifications?: string[];
  isDragging?: boolean;
  error?: string | null;
}

interface IState {
  selectedPatientConcernId: string;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedPatientConcernId: '',
    };
  }

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
          taskIdsWithNotifications={taskIdsWithNotifications}
        />
        <TextDivider messageId="patientMap.nextUp" hasPadding={true} />
        <DnDPatientConcerns
          concerns={inactiveConcerns}
          inactive={true}
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
