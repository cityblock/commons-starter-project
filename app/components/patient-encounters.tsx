import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { IPatientEncounterEdges } from 'schema';
import * as styles from '../css/components/patient-encounters.css';
import { getQuery } from '../graphql/helpers';
import { FullPatientEncounterFragment } from '../graphql/types';
import { EncountersLoadingError } from './encounters-loading-error';
import PatientEncounter from './patient-encounter';

interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientEncounters?: FullPatientEncounterFragment[];
  refetchPatientEncounters?: (variables: { patientId: string }) => any;
}

const newEncounterButtonStyles = classNames(styles.invertedButton, styles.newEncounterButton);

class PatientEncounters extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.renderPatientEncounters = this.renderPatientEncounters.bind(this);
    this.renderPatientEncounter = this.renderPatientEncounter.bind(this);
    this.reloadPatientEncounters = this.reloadPatientEncounters.bind(this);

    this.state = {
      selectedMedicationId: null,
    };
  }

  renderPatientEncounters(encounters: FullPatientEncounterFragment[]) {
    const { loading, error } = this.props;

    if (encounters.length) {
      return encounters.map(this.renderPatientEncounter);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyEncountersMessage}>
          <div className={styles.emptyEncountersLogo}></div>
          <div className={styles.emptyEncountersLabel}>No encounter history for this patient</div>
          <div className={styles.emptyEncountersSubtext}>
            Future encounters with this patient will be displayed here.
          </div>
        </div>
      );
    } else {
      return (
        <EncountersLoadingError
          error={error}
          loading={loading}
          onRetryClick={this.reloadPatientEncounters}
        />
      );
    }
  }

  renderPatientEncounter(encounter: FullPatientEncounterFragment) {
    return (
      <PatientEncounter
        key={encounter.encounterId}
        encounter={encounter}
      />
    );
  }

  reloadPatientEncounters() {
    const { patientId, refetchPatientEncounters } = this.props;

    if (refetchPatientEncounters) {
      refetchPatientEncounters({ patientId });
    }
  }

  render() {
    const { patientEncounters } = this.props;
    const encountersList = patientEncounters || [];

    const encountersListStyles = classNames(styles.encounters, {
      [styles.emptyEncountersList]: !encountersList.length,
    });

    return (
      <div className={styles.encountersPanel}>
        <div className={styles.newEncounter}>
          <div className={newEncounterButtonStyles}>Record new encounter</div>
        </div>
        <div className={encountersListStyles}>
          {this.renderPatientEncounters(encountersList)}
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
    refetchPatientEncounters: (data ? data.refetch : null),
  }),
})(PatientEncounters);
