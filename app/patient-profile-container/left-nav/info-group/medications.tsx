import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import patientMedicationsQuery from '../../../graphql/queries/get-patient-medications.graphql';
import { getPatientMedicationsQuery } from '../../../graphql/types';
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
  patientMedications: getPatientMedicationsQuery['patientMedications'];
  isLoading: boolean;
  error: ApolloError | null | undefined;
}

export type allProps = IGraphqlProps & IProps;

export const Medications: React.StatelessComponent<allProps> = (props: allProps) => {
  const { isOpen, onClick, patientMedications, isLoading, error } = props;

  let itemCount: number | null = null;
  let medicationsContainerHtml = null;

  if (!isLoading && !error && !!patientMedications && patientMedications.length) {
    itemCount = patientMedications.length;
    const patientMedicationsHtml = patientMedications.map((medication, index) => (
      <InfoGroupItem
        key={`patient-medication-${index}`}
        label={medication.name}
        value={medication.dosage}
      />
    ));
    medicationsContainerHtml = (
      <InfoGroupContainer isOpen={isOpen}>{patientMedicationsHtml}</InfoGroupContainer>
    );
  }

  return (
    <div className={styles.container}>
      <InfoGroupHeader
        selected="medications"
        isOpen={isOpen}
        onClick={onClick}
        itemCount={itemCount}
      />
      {medicationsContainerHtml}
    </div>
  );
};

export default graphql(patientMedicationsQuery, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientMedications: data ? (data as any).patientMedications : null,
  }),
})(Medications);
