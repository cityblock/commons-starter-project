import * as React from 'react';
import { FullPatientConcernFragment } from '../graphql/types';
import Spinner from '../shared/library/spinner/spinner';
import TextDivider from '../shared/library/text-divider/text-divider';
import * as styles from './css/patient-care-plan.css';
import DnDPatientConcerns from './drag-and-drop/patient-concerns';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  selectedTaskId: string;
  activeConcerns: FullPatientConcernFragment[];
  inactiveConcerns: FullPatientConcernFragment[];
  isDragging?: boolean;
}

interface IState {
  selectedPatientConcernId: string;
  optionsDropdownConcernId: string;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedPatientConcernId: '',
      optionsDropdownConcernId: '',
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.isDragging) {
      this.setState(() => ({
        selectedPatientConcernId: '',
        optionsDropdownConcernId: '',
      }));
    }
  }

  onClickPatientConcern = (patientConcernId: string) => {
    const { selectedPatientConcernId } = this.state;

    if (patientConcernId === selectedPatientConcernId) {
      this.setState(() => ({ selectedPatientConcernId: '' }));
    } else {
      this.setState(() => ({ selectedPatientConcernId: patientConcernId }));
    }
  };

  onOptionsToggle = (patientConcernId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    // do nothing if task open as we close task on clicking outside of task
    if (this.props.selectedTaskId) return;

    // Prevents closing of selected concern if unselected concern options toggle clicked
    e.stopPropagation();

    const { optionsDropdownConcernId } = this.state;

    if (patientConcernId === optionsDropdownConcernId) {
      this.setState(() => ({ optionsDropdownConcernId: undefined }));
    } else {
      this.setState(() => ({ optionsDropdownConcernId: patientConcernId }));
    }
  };

  render(): JSX.Element {
    const { loading, selectedTaskId, activeConcerns, inactiveConcerns } = this.props;
    const { selectedPatientConcernId, optionsDropdownConcernId } = this.state;

    if (loading) return <Spinner />;

    return (
      <div className={styles.carePlan}>
        <DnDPatientConcerns
          concerns={activeConcerns}
          inactive={false}
          selectedPatientConcernId={selectedPatientConcernId}
          optionsDropdownConcernId={optionsDropdownConcernId}
          onClick={this.onClickPatientConcern}
          onOptionsToggle={this.onOptionsToggle}
          selectedTaskId={selectedTaskId}
        />
        <TextDivider messageId="patientMap.nextUp" />
        <DnDPatientConcerns
          concerns={inactiveConcerns}
          inactive={true}
          selectedPatientConcernId={selectedPatientConcernId}
          optionsDropdownConcernId={optionsDropdownConcernId}
          onClick={this.onClickPatientConcern}
          onOptionsToggle={this.onOptionsToggle}
          selectedTaskId={selectedTaskId}
        />
      </div>
    );
  }
}
