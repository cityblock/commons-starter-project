import { ApolloError } from 'apollo-client';
import { toString } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientEncountersQuery from '../../graphql/queries/get-patient-encounters.graphql';
import { getPatientEncountersQuery, FullPatientEncounterFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import * as styles from './css/patient-timeline.css';
import { ProgressNoteLoadingError } from './progress-note-loading-error';
import ProgressNoteRow from './progress-note-row';
import TimelineCard from './shared/timeline-card';

interface IProps {
  match: {
    params: {
      patientId: string;
    };
  };
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  patientEncounters: getPatientEncountersQuery['patientEncounters'];
}

interface IState {
  loading?: boolean;
  error: ApolloError | null | undefined;
  isQuickCallPopupVisible: boolean;
}

type allProps = IProps & IGraphqlProps;

export class PatientTimeline extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: props.loading,
      error: props.error,
      isQuickCallPopupVisible: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error } = nextProps;

    this.setState({ loading, error });
  }

  renderPatientEncounters = () => {
    const patientEncounters = this.props.patientEncounters || [];
    const { loading, error } = this.state;

    if (patientEncounters && patientEncounters.length) {
      return patientEncounters.map(this.renderPatientEncounter);
    } else if (!loading && !error) {
      return (
        <div className={styles.empty}>
          <EmptyPlaceholder
            icon="eventNote"
            headerMessageId="progressNote.emptyHeader"
            detailMessageId="progressNote.emptyDetail"
          />
        </div>
      );
    } else {
      return <ProgressNoteLoadingError error={error} loading={loading} />;
    }
  };

  renderPatientEncounter = (patientEncounter: FullPatientEncounterFragment) => {
    const { id, location, source, date, title, notes, progressNoteId } = patientEncounter;
    const { patientId } = this.props.match.params;

    if (progressNoteId) {
      return (
        <ProgressNoteRow
          key={progressNoteId}
          progressNoteId={progressNoteId}
          patientId={patientId}
          glassBreakId={this.props.glassBreakId}
        />
      );
    } else {
      return (
        <TimelineCard
          key={id}
          source={toString(location)}
          sourceDetail={toString(source)}
          title={toString(title)}
          date={date}
          notes={notes}
        />
      );
    }
  };

  showNewQuickCallPopup = () => {
    this.setState({
      isQuickCallPopupVisible: true,
    });
  };

  hideNewQuickCallPopup = () => {
    this.setState({
      isQuickCallPopupVisible: false,
    });
  };

  render() {
    return (
      <div className={styles.progressNotesContainer}>
        <div className={styles.progressNotes}>{this.renderPatientEncounters()}</div>
      </div>
    );
  }
}

export default graphql(patientEncountersQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.match.params.patientId,
      glassBreakId: props.glassBreakId,
    },
  }),
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    patientEncounters: data ? (data as any).patientEncounters : null,
  }),
})(PatientTimeline);
