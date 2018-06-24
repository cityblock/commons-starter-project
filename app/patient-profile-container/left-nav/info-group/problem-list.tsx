import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import patientProblemListGraphql from '../../../graphql/queries/get-patient-problem-list.graphql';
import { getPatientProblemList } from '../../../graphql/types';
import { Accordion } from '../left-nav';
import InfoGroupContainer from './container';
import styles from './css/shared.css';
import InfoGroupHeader from './header';
import InfoGroupItem from './item';

interface IProps {
  patientId: string;
  isOpen: boolean;
  onClick: (clicked: Accordion) => void;
}

interface IGraphqlProps {
  patientProblemList: getPatientProblemList['patientProblemList'];
  isLoading: boolean;
  error: ApolloError | null | undefined;
}

export type allProps = IGraphqlProps & IProps;

export const ProblemList: React.StatelessComponent<allProps> = (props: allProps) => {
  const { isOpen, onClick, patientProblemList, isLoading, error } = props;

  let itemCount: number | null = null;
  let problemListContainerHtml = null;

  if (!isLoading && !error && !!patientProblemList && patientProblemList.length) {
    itemCount = patientProblemList.length;
    const patientProblemListHtml = patientProblemList.map((diagnosis, index) => (
      <InfoGroupItem
        key={`patient-problem-${index}`}
        label={diagnosis.name}
        value={diagnosis.code}
      />
    ));
    problemListContainerHtml = (
      <InfoGroupContainer isOpen={isOpen}>{patientProblemListHtml}</InfoGroupContainer>
    );
  }

  return (
    <div className={styles.container}>
      <InfoGroupHeader
        selected="problemList"
        isOpen={isOpen}
        onClick={onClick}
        itemCount={itemCount}
      />
      {problemListContainerHtml}
    </div>
  );
};

export default graphql(patientProblemListGraphql, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientProblemList: data ? (data as any).patientProblemList : null,
  }),
})(ProblemList);
