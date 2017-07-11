import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as styles from '../css/components/patient-encounters.css';
import * as sortSearchStyles from '../css/shared/sort-search.css';
import * as patientEncountersQuery from '../graphql/queries/get-patient-encounters.graphql';
import { FullPatientEncounterFragment } from '../graphql/types';
import { EncountersLoadingError } from './encounters-loading-error';
import Lightbox from './lightbox';
import NewPatientEncounter from './new-patient-encounter';
import PatientEncounter from './patient-encounter';

export interface IProps {
  patientId: string;
  loading?: boolean;
  error?: string;
  patientEncounters?: FullPatientEncounterFragment[];
  refetchPatientEncounters?: (variables: { patientId: string }) => any;
}

export interface IState {
  loading?: boolean;
  error?: string;
  clickedAttachment?: string;
  lightboxAttachments: string[];
  lightboxIsOpen: boolean;
}

class PatientEncounters extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { loading, error } = props;

    this.renderPatientEncounters = this.renderPatientEncounters.bind(this);
    this.renderPatientEncounter = this.renderPatientEncounter.bind(this);
    this.reloadPatientEncounters = this.reloadPatientEncounters.bind(this);
    this.onClickAttachment = this.onClickAttachment.bind(this);
    this.onLightboxDismiss = this.onLightboxDismiss.bind(this);

    this.state = { loading, error, lightboxIsOpen: false, lightboxAttachments: [] };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  onClickAttachment(clickedAttachment: string, allAttachments: string[]) {
    this.setState(() => ({
      lightboxIsOpen: true,
      clickedAttachment,
      lightboxAttachments: allAttachments,
    }));
  }

  onLightboxDismiss() {
    this.setState(() => ({ lightboxIsOpen: false }));
  }

  renderPatientEncounters(encounters: FullPatientEncounterFragment[]) {
    const { loading, error } = this.state;

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
        onClickAttachment={this.onClickAttachment}
      />
    );
  }

  async reloadPatientEncounters() {
    const { patientId, refetchPatientEncounters } = this.props;

    if (refetchPatientEncounters) {
      try {
        this.setState(() => ({ loading: true, error: undefined }));
        await refetchPatientEncounters({ patientId });
      } catch (err) {
        // TODO: This is redundant. Props will get set by the result of the refetch.
        this.setState(() => ({ loading: false, error: err.message }));
      }
    }
  }

  render() {
    const { lightboxAttachments, clickedAttachment, lightboxIsOpen } = this.state;
    const { patientEncounters, patientId } = this.props;
    const encountersList = patientEncounters || [];

    const encountersListStyles = classNames(styles.encounters, {
      [styles.emptyEncountersList]: !encountersList.length,
    });

    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value='Newest first'>
                <option value='Newest first'>Newest first</option>
              </select>
            </div>
          </div>
          <div className={sortSearchStyles.search}>
            <input required type='text' placeholder='Search by user or keywords' />
          </div>
        </div>
        <div className={styles.encountersPanel}>
          <NewPatientEncounter patientId={ patientId } />
          <div className={encountersListStyles}>
            {this.renderPatientEncounters(encountersList)}
          </div>
        </div>
        <Lightbox
          images={lightboxAttachments}
          isOpen={lightboxIsOpen}
          openingImage={clickedAttachment}
          onDismiss={this.onLightboxDismiss}
        />
      </div>
    );
  }
}

export default graphql(patientEncountersQuery as any, {
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
