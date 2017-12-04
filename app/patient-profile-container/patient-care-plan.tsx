import * as classNames from 'classnames';
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
  error?: string;
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
    const { loading, selectedTaskId, activeConcerns, inactiveConcerns, error } = this.props;
    if (loading) return <Spinner />;

    const { selectedPatientConcernId } = this.state;
    const carePlanStyles = classNames(styles.carePlan, {
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
        />
        <TextDivider messageId="patientMap.nextUp" />
        <DnDPatientConcerns
          concerns={inactiveConcerns}
          inactive={true}
          selectedPatientConcernId={selectedPatientConcernId}
          onClick={this.onClickPatientConcern}
          selectedTaskId={selectedTaskId}
        />
      </div>
    );
  }
}
