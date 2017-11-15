import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientEncountersQuery from '../graphql/queries/get-patient-encounters.graphql';
import { getPatientEncountersQuery, FullPatientEncounterFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/patient-encounters.css';
import * as patientInfoStyles from './css/patient-info.css';
import { EncountersLoadingError } from './encounters-loading-error';
import Lightbox from './lightbox';
import PatientEncounter from './patient-encounter';
import ProgressNotePopup from './progress-note-popup';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  patientEncounters?: getPatientEncountersQuery['patientEncounters'];
  refetchPatientEncounters?: (variables: { patientId: string }) => any;
}

interface IState {
  loading?: boolean;
  error?: string;
  clickedAttachment?: string;
  lightboxAttachments: string[];
  isLightboxOpen: boolean;
  isProgressNotePopupVisible: boolean;
}

class PatientEncounters extends React.Component<IProps & IGraphqlProps, IState> {
  constructor(props: IProps & IGraphqlProps) {
    super(props);

    const { loading, error } = props;

    this.renderPatientEncounters = this.renderPatientEncounters.bind(this);
    this.renderPatientEncounter = this.renderPatientEncounter.bind(this);
    this.reloadPatientEncounters = this.reloadPatientEncounters.bind(this);
    this.onClickAttachment = this.onClickAttachment.bind(this);
    this.onLightboxDismiss = this.onLightboxDismiss.bind(this);
    this.showNewProgressNotePopup = this.showNewProgressNotePopup.bind(this);
    this.hideNewProgressNotePopup = this.hideNewProgressNotePopup.bind(this);

    this.state = {
      loading,
      error,
      isLightboxOpen: false,
      lightboxAttachments: [],
      isProgressNotePopupVisible: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps & IGraphqlProps) {
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

  renderPatientEncounters(encounters: Array<FullPatientEncounterFragment | null>) {
    const { loading, error } = this.state;

    if (encounters.length) {
      return encounters.map(this.renderPatientEncounter);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyEncountersMessage}>
          <div className={styles.emptyEncountersLogo} />
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

  showNewProgressNotePopup() {
    this.setState({
      isProgressNotePopupVisible: true,
    });
  }

  hideNewProgressNotePopup() {
    this.setState({
      isProgressNotePopupVisible: false,
    });
  }

  render() {
    const {
      lightboxAttachments,
      clickedAttachment,
      isLightboxOpen,
      isProgressNotePopupVisible,
    } = this.state;
    const { patientEncounters, patientId } = this.props;
    const encountersList = patientEncounters || [];

    const saveButtonStyles = classNames(patientInfoStyles.button, patientInfoStyles.saveButton);

    return (
      <div>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value="Newest first">
                <option value="Newest first">Newest first</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, sortSearchStyles.searchLeftPad)}>
              <input required type="text" placeholder="Search by user or keywords" />
            </div>
          </div>
          <div className={patientInfoStyles.saveButtonGroup}>
            <div className={saveButtonStyles} onClick={this.showNewProgressNotePopup}>
              <FormattedMessage id="patient.newProgressNote">
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
            </div>
          </div>
        </div>
        <div className={styles.encountersPanel}>
          <div className={styles.encounters}>{this.renderPatientEncounters(encountersList)}</div>
        </div>
        <Lightbox
          images={lightboxAttachments}
          isOpen={isLightboxOpen}
          openingImage={clickedAttachment}
          onDismiss={this.onLightboxDismiss}
        />
        <ProgressNotePopup
          patientId={patientId}
          visible={isProgressNotePopupVisible}
          close={this.hideNewProgressNotePopup}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps>(patientEncountersQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientEncounters: data ? (data as any).patientEncounters : null,
    refetchPatientEncounters: data ? data.refetch : null,
  }),
})(PatientEncounters);
