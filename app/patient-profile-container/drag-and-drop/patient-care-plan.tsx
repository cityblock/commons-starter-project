import { isEqual } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
/* tslint:disable:max-line-length */
import * as patientConcernBulkEditMutationGraphql from '../../graphql/queries/patient-concern-bulk-edit-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  patientConcernBulkEditMutation,
  patientConcernBulkEditMutationVariables,
} from '../../graphql/types';
import {
  getPatientCarePlanQuery,
  FullPatientConcernFragment,
  PatientConcernBulkEditFields,
} from '../../graphql/types';
import { getOrderDiffs, insert, remove, reorder } from '../../shared/helpers/order-helpers';
import PatientCarePlan from '../patient-care-plan';
import * as styles from './css/patient-care-plan.css';

interface IProps {
  loading?: boolean;
  routeBase: string;
  patientId: string;
  carePlan?: getPatientCarePlanQuery['carePlanForPatient'];
  selectedTaskId: string;
}

interface IGraphqlProps {
  patientConcernBulkEdit: (
    options: { variables: patientConcernBulkEditMutationVariables },
  ) => { data: patientConcernBulkEditMutation };
}

export type allProps = IProps & IGraphqlProps;

interface IState {
  activeConcerns: FullPatientConcernFragment[];
  inactiveConcerns: FullPatientConcernFragment[];
  isDragging: boolean;
  loading: boolean;
  reorderError: string;
}

export class DnDPatientCarePlan extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      activeConcerns: [],
      inactiveConcerns: [],
      isDragging: false,
      loading: false,
      reorderError: '',
    };
  }

  componentWillReceiveProps(nextProps: allProps): void {
    if (!nextProps.carePlan || !nextProps.carePlan.concerns.length) return;

    const activeConcerns = nextProps.carePlan.concerns
      .filter((patientConcern: FullPatientConcernFragment) => !!patientConcern.startedAt)
      .sort((a, b) => a.order - b.order);
    const inactiveConcerns = nextProps.carePlan.concerns
      .filter((patientConcern: FullPatientConcernFragment) => !patientConcern.startedAt)
      .sort((a, b) => a.order - b.order);

    if (!isEqual(this.state.activeConcerns, activeConcerns)) {
      this.setState(() => ({ activeConcerns }));
    }

    if (!isEqual(this.state.inactiveConcerns, inactiveConcerns)) {
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
    const endList = result.destination!.droppableId as 'activeConcerns' | 'inactiveConcerns';

    const updatedConcerns = reorder(
      this.state[endList],
      result.source.index,
      result.destination!.index,
    );

    const orderDiffs = getOrderDiffs(
      this.state[endList as 'activeConcerns' | 'inactiveConcerns'],
      updatedConcerns,
      endList === 'inactiveConcerns' ? this.state.activeConcerns.length : 0,
    );

    this.updateConcernOrder(orderDiffs);

    this.setState(() => ({ [endList]: updatedConcerns }));
  }

  moveBetweenConcernLists(result: DropResult): void {
    const startList = result.source.droppableId as 'activeConcerns' | 'inactiveConcerns';
    const endList = result.destination!.droppableId as 'activeConcerns' | 'inactiveConcerns';

    const updatedStartList = remove(
      this.state[startList],
      this.state[startList].findIndex(concern => concern.id === result.draggableId),
    ) as FullPatientConcernFragment[];

    const updatedEndList = insert(
      this.state[endList],
      this.state[startList].find(concern => concern.id === result.draggableId),
      result.destination!.index,
    ) as FullPatientConcernFragment[];

    const newList =
      startList === 'activeConcerns'
        ? updatedStartList.concat(updatedEndList)
        : updatedEndList.concat(updatedStartList);

    const orderDiffs = getOrderDiffs(
      this.state.activeConcerns.concat(this.state.inactiveConcerns),
      newList,
      0,
      result.draggableId,
    );

    this.updateConcernOrder(orderDiffs);

    this.setState(() => ({
      [startList]: updatedStartList,
      [endList]: updatedEndList,
    }));
  }

  async updateConcernOrder(orderDiffs: PatientConcernBulkEditFields[]) {
    const { patientConcernBulkEdit, patientId } = this.props;

    if (!this.state.loading) {
      this.setState(() => ({ loading: true, reorderError: '' }));

      try {
        await patientConcernBulkEdit({ variables: { patientConcerns: orderDiffs, patientId } });
        this.setState(() => ({ loading: false }));
      } catch (err) {
        this.setState(() => ({ loading: false, reorderError: err.message }));
      }
    }
  }

  render(): JSX.Element {
    const { loading, routeBase, patientId, selectedTaskId } = this.props;
    const { activeConcerns, inactiveConcerns, isDragging, reorderError } = this.state;

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
            error={reorderError}
          />
        </DragDropContext>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(
  patientConcernBulkEditMutationGraphql as any,
  {
    name: 'patientConcernBulkEdit',
  },
)(DnDPatientCarePlan);
