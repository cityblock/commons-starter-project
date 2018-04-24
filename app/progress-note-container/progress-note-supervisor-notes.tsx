import { debounce } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as progressNoteAddSupervisorNotesMutationGraphql from '../graphql/queries/progress-note-add-supervisor-notes-mutation.graphql';
import {
  progressNoteAddSupervisorNotesMutation,
  progressNoteAddSupervisorNotesMutationVariables,
  FullProgressNoteFragment,
} from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Textarea from '../shared/library/textarea/textarea';
import * as styles from './css/progress-note-context.css';

interface IProps {
  progressNote?: FullProgressNoteFragment;
}

interface IGraphqlProps {
  progressNoteAddSupervisorNotes?: (
    options: { variables: progressNoteAddSupervisorNotesMutationVariables },
  ) => { data: progressNoteAddSupervisorNotesMutation };
}

type allProps = IGraphqlProps & IProps;

interface IState {
  progressNoteSupervisorReview: string | null;
  loading?: boolean;
  error: string | null;
}

const SAVE_TIMEOUT_MILLISECONDS = 500;

export class ProgressNoteSupervisorNotes extends React.Component<allProps, IState> {
  deferredSaveSupervisorNotes: () => void;

  constructor(props: allProps) {
    super(props);
    const { progressNote } = props;
    this.deferredSaveSupervisorNotes = debounce(
      this.saveSupervisorNotes,
      SAVE_TIMEOUT_MILLISECONDS,
    );
    this.state = {
      loading: false,
      error: null,

      progressNoteSupervisorReview:
        progressNote && progressNote.supervisorNotes ? progressNote.supervisorNotes : '',
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    // setup default state
    if (newProps.progressNote && !this.props.progressNote) {
      this.setDefaultProgressNoteFields(newProps);
    }
  }

  setDefaultProgressNoteFields(props: allProps) {
    const { progressNote } = props;
    this.setState({
      progressNoteSupervisorReview:
        progressNote && progressNote.supervisorNotes ? progressNote.supervisorNotes : '',
    });
  }

  onProgressNoteSupervisorReviewChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    await this.setState({
      progressNoteSupervisorReview: event.currentTarget.value,
    });
    this.deferredSaveSupervisorNotes();
  };

  saveSupervisorNotes = () => {
    const { progressNoteSupervisorReview } = this.state;
    const { progressNote } = this.props;

    if (this.props.progressNoteAddSupervisorNotes && progressNote && progressNoteSupervisorReview) {
      this.props.progressNoteAddSupervisorNotes({
        variables: {
          progressNoteId: progressNote.id,
          supervisorNotes: progressNoteSupervisorReview,
        },
      });
    }
  };

  render() {
    const { progressNoteSupervisorReview } = this.state;
    return (
      <div>
        <div className={styles.summaryContainer}>
          <FormLabel messageId="progressNote.contextAndPlan" htmlFor="contextAndPlan" />
          <br />
          <br />
          <Textarea
            value={progressNoteSupervisorReview || ''}
            onChange={this.onProgressNoteSupervisorReviewChange}
          />
        </div>
      </div>
    );
  }
}

export default graphql<any>(progressNoteAddSupervisorNotesMutationGraphql as any, {
  name: 'progressNoteAddSupervisorNotes',
})(ProgressNoteSupervisorNotes) as React.ComponentClass<IProps>;
