import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getCurrentUser from '../../graphql/queries/get-current-user.graphql';
import { FullPatientConcern, FullUser } from '../../graphql/types';
import DnDPatientConcern from '../../patient-profile-container/drag-and-drop/drag-and-drop-patient-concern';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';

interface IProps {
  concerns: FullPatientConcern[];
  selectedPatientConcernId: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  selectedTaskId: string;
  selectedGoalId: string;
  taskIdsWithNotifications?: string[];
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  currentUser: FullUser;
}

type allProps = IProps & IGraphqlProps;

export const PatientConcerns: React.StatelessComponent<allProps> = (props: allProps) => {
  const {
    selectedPatientConcernId,
    concerns,
    inactive,
    onClick,
    selectedTaskId,
    selectedGoalId,
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
        selectedGoalId={selectedGoalId}
        taskIdsWithNotifications={taskIdsWithNotifications}
        currentUserId={currentUser.id}
      />
    );
  });

  return <React.Fragment>{renderedConcerns}</React.Fragment>;
};

export default graphql<any, any, any, any>(getCurrentUser, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    currentUser: data ? (data as any).currentUser : null,
  }),
})(PatientConcerns) as React.ComponentClass<IProps>;
