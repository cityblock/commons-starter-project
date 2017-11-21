import * as _ from 'lodash';
import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../graphql/types';
import { getPatientCarePlanQuery } from '../graphql/types';
import PatientConcerns from '../shared/concerns';
import { insert, remove, reorder } from '../shared/helpers/order-helpers';
import TextDivider from '../shared/text-divider';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  selectedTaskId: string;
}

interface IState {
  selectedPatientConcernId: string;
  optionsDropdownConcernId: string;
  activeConcerns: FullPatientConcernFragment[];
  inactiveConcerns: FullPatientConcernFragment[];
  isDragging: boolean;
}

export default class PatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedPatientConcernId: '',
      optionsDropdownConcernId: '',
      activeConcerns: [],
      inactiveConcerns: [],
      isDragging: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.carePlan || !nextProps.carePlan.concerns.length) return;

    const activeConcerns = nextProps.carePlan.concerns.filter(
      (patientConcern: FullPatientConcernFragment) => !!patientConcern.startedAt,
    );
    const inactiveConcerns = nextProps.carePlan.concerns.filter(
      (patientConcern: FullPatientConcernFragment) => !patientConcern.startedAt,
    );

    if (!_.isEqual(this.state.activeConcerns, activeConcerns)) {
      this.setState(() => ({ activeConcerns }));
    }

    if (!_.isEqual(this.state.inactiveConcerns, inactiveConcerns)) {
      this.setState(() => ({ inactiveConcerns }));
    }
  }

  onDragStart = () => {
    // close open concerns and options menu when dragging
    // will likely remove this and handle when we put re-ordering behind menu option
    this.setState(() => ({
      selectedPatientConcernId: '',
      optionsDropdownConcernId: '',
      isDragging: true,
    }));
  }

  onDragEnd = (result: DropResult) => {
    // dropped outside the list of concerns
    if (!result.destination) return;

    // if moving around within active or inactive concern group
    if (result.source.droppableId === result.destination.droppableId) {
      this.reorderConcernList(result);
    // if switching from one group to another
    } else {
      this.moveBetweenConcernLists(result);
    }

    this.setState(() => ({ isDragging: false }));
  }

  reorderConcernList(result: DropResult) {
    const endList = result.destination!.droppableId;

    const updatedConcerns = reorder(
      this.state[endList as 'activeConcerns' | 'inactiveConcerns'],
      result.source.index,
      result.destination!.index,
    );

    this.setState(() => ({ [endList]: updatedConcerns }));
  }

  moveBetweenConcernLists(result: DropResult) {
    const startList = result.source.droppableId;
    const endList = result.destination!.droppableId;

    const updatedStartList = remove(
      this.state[startList as 'activeConcerns' | 'inactiveConcerns'],
      this.state[startList as 'activeConcerns' | 'inactiveConcerns'].findIndex(
        concern => concern.id === result.draggableId,
      ),
    );

    const updatedEndList = insert(
      this.state[endList as 'activeConcerns' | 'inactiveConcerns'],
      this.state[startList as 'activeConcerns' | 'inactiveConcerns'].find(
        concern => concern.id === result.draggableId,
      ),
      result.destination!.index,
    );

    this.setState(() => ({
      [startList]: updatedStartList,
      [endList]: updatedEndList,
    }));
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

  renderCarePlan() {
    const { loading, selectedTaskId } = this.props;
    const {
      selectedPatientConcernId,
      optionsDropdownConcernId,
      activeConcerns,
      inactiveConcerns,
      isDragging,
    } = this.state;

    if (loading) {
      return (
        <div className={styles.emptyCarePlanSuggestionsContainer}>
          <div className={styles.loadingLabel}>Loading...</div>
        </div>
      );
    }

    if (!activeConcerns.length) {
      return null;
    }

    return (
      <div className={isDragging ? styles.draggable : ''}>
        <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
          <PatientConcerns
            concerns={activeConcerns}
            selectedPatientConcernId={selectedPatientConcernId}
            optionsDropdownConcernId={optionsDropdownConcernId}
            onClick={this.onClickPatientConcern}
            onOptionsToggle={this.onOptionsToggle}
            selectedTaskId={selectedTaskId}
          />
          <TextDivider label='Next Up' />
          <PatientConcerns
            concerns={inactiveConcerns}
            inactive={true}
            selectedPatientConcernId={selectedPatientConcernId}
            optionsDropdownConcernId={optionsDropdownConcernId}
            onClick={this.onClickPatientConcern}
            onOptionsToggle={this.onOptionsToggle}
            selectedTaskId={selectedTaskId}
          />
        </DragDropContext>
      </div>
    );
  }

  render() {
    return <div className={styles.carePlan}>{this.renderCarePlan()}</div>;
  }
}
