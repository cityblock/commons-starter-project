import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getCurrentUserQuery from '../../graphql/queries/get-current-user.graphql';
import { FullPatientConcernFragment, FullUserFragment } from '../../graphql/types';
import DnDPatientConcern from '../../patient-profile-container/drag-and-drop/drag-and-drop-patient-concern';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  selectedTaskId: string;
  taskIdsWithNotifications?: string[];
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  currentUser: FullUserFragment;
}

type allProps = IProps & IGraphqlProps;

export const PatientConcerns: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    selectedPatientConcernId,
    concerns,
    inactive,
    onClick,
    selectedTaskId,
    taskIdsWithNotifications,
    currentUser,
  } = props;

  if (inactive && (!concerns.length || concerns.every(concern => !!concern.deletedAt))) {
    return (
      <EmptyPlaceholder
        headerMessageId="patientMap.emptyNextUpHeader"
        detailMessageId="patientMap.emptyNextUpDetail"
      />
    );
  }

  const renderedConcerns = concerns.map((concern, index) => {
    const selected = !!selectedPatientConcernId && selectedPatientConcernId === concern.id;

    return (
      <DnDPatientConcern
        key={concern.id}
        index={index}
        selected={selected}
        patientConcern={concern}
        onClick={() => onClick(concern.id)}
        inactive={inactive || false}
        selectedTaskId={selectedTaskId}
        taskIdsWithNotifications={taskIdsWithNotifications}
        currentUserId={currentUser.id}
      />
    );
  });

  return <React.Fragment>{renderedConcerns}</React.Fragment>;
};

export default graphql<IGraphqlProps, IProps, allProps>(getCurrentUserQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    currentUser: data ? (data as any).currentUser : null,
  }),
})(PatientConcerns);
