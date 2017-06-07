import * as React from 'react';
import { graphql } from 'react-apollo';
import { IPatientEncounterEdges } from 'schema';
import * as styles from '../css/components/patient-encounters.css';
import { getQuery } from '../graphql/helpers';
import { FullPatientEncounterFragment } from '../graphql/types';
import PatientEncounter from './patient-encounter';

interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientEncounters?: FullPatientEncounterFragment[];
}

class PatientEncounters extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedMedicationId: null,
    };
  }

  renderPatientEncounter(encounter: FullPatientEncounterFragment) {
    return (
      <PatientEncounter
        key={encounter.encounterId}
        encounter={encounter}
      />
    );
  }

  render() {
    const { patientEncounters } = this.props;
    const renderedPatientEncounters = (patientEncounters || []).map(this.renderPatientEncounter);

    return (
      <div className={styles.encountersPanel}>
        <div className={styles.newEncounter}>
          <div className={styles.newEncounterButton}>Record new encounter</div>
        </div>
        <div className={styles.encounters}>
          {renderedPatientEncounters}
        </div>
      </div>
    );
  }
}

const formatPatientEncounters = (
  encountersResponse: IPatientEncounterEdges,
): FullPatientEncounterFragment[] => {
  if (encountersResponse && encountersResponse.edges) {
    return encountersResponse.edges.map(edge => (edge.node as FullPatientEncounterFragment));
  } else {
    return [];
  }
};

const patientEncountersQuery = getQuery('app/graphql/queries/get-patient-encounters.graphql');

export default graphql(patientEncountersQuery, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
      pageNumber: 0,
      pageSize: 10,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientEncounters: (data ? formatPatientEncounters((data as any).patientEncounters) : null),
  }),
})(PatientEncounters);
