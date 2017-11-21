import * as _ from 'lodash';
import * as React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import { getPatientCarePlanQuery } from '../../graphql/types';
import { insert, remove, reorder } from '../../shared/helpers/order-helpers';
import PatientCarePlan from '../patient-care-plan';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  selectedTaskId: string;
}

interface IState {
  activeConcerns: FullPatientConcernFragment[];
  inactiveConcerns: FullPatientConcernFragment[];
  isDragging: boolean;
}

export class DnDPatientCarePlan extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      activeConcerns: [],
      inactiveConcerns: [],
      isDragging: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps): void {
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

  onDragStart = (): void => {
    this.setState(() => ({
      isDragging: true,
    }));
  };

  onDragEnd = (result: DropResult): void => {
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
  };

  reorderConcernList(result: DropResult): void {
    const endList = result.destination!.droppableId;

    const updatedConcerns = reorder(
      this.state[endList as 'activeConcerns' | 'inactiveConcerns'],
      result.source.index,
      result.destination!.index,
    );

    this.setState(() => ({ [endList]: updatedConcerns }));
  }

  moveBetweenConcernLists(result: DropResult): void {
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

  render(): JSX.Element {
    const { loading, routeBase, patientId, selectedTaskId } = this.props;
    const { activeConcerns, inactiveConcerns, isDragging } = this.state;

    return (
      <div className={isDragging ? styles.draggable : ''}>
        <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
          <PatientCarePlan
            loading={loading}
            routeBase={routeBase}
            patientId={patientId}
            selectedTaskId={selectedTaskId}
            activeConcerns={activeConcerns}
            inactiveConcerns={inactiveConcerns}
            isDragging={isDragging}
          />
        </DragDropContext>
      </div>
    );
  }
}

export default DnDPatientCarePlan;
