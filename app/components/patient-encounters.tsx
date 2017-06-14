import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as styles from '../css/components/patient-encounters.css';
import { getQuery } from '../graphql/helpers';
import { FullPatientEncounterFragment } from '../graphql/types';
import { EncountersLoadingError } from './encounters-loading-error';
import NewPatientEncounter from './new-patient-encounter';
import PatientEncounter from './patient-encounter';

interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientEncounters?: FullPatientEncounterFragment[];
  refetchPatientEncounters?: (variables: { patientId: string }) => any;
}

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

  renderPatientEncounter(encounter: FullPatientEncounterFragment, index: number) {
    return (
      <PatientEncounter
        key={index}
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
    const { patientEncounters, patientId } = this.props;
    const encountersList = patientEncounters || [];

    const encountersListStyles = classNames(styles.encounters, {
      [styles.emptyEncountersList]: !encountersList.length,
    });

    return (
      <div className={styles.encountersPanel}>
        <NewPatientEncounter patientId={ patientId } />
        <div className={encountersListStyles}>
          {this.renderPatientEncounters(encountersList)}
        </div>
      </div>
    );
  }
}

const patientEncountersQuery = getQuery('app/graphql/queries/get-patient-encounters.graphql');

export default graphql(patientEncountersQuery, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    patientEncounters: (data ? (data as any).patientEncounters : null),
    refetchPatientEncounters: (data ? data.refetch : null),
  }),
})(PatientEncounters);
