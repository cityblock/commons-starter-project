import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import progressNoteGraphql from '../../graphql/queries/get-progress-note.graphql';
import { FullProgressNote } from '../../graphql/types';
import progressNoteGlassBreak, {
  IInjectedProps,
} from '../../shared/glass-break/progress-note-glass-break';
import { formatCareTeamMemberRole, formatFullName } from '../../shared/helpers/format-helpers';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import ProgressNoteActivity from '../../shared/progress-note-activity/progress-note-activity';
import styles from './css/progress-note-row.css';
import ProgressNoteRowQuestions from './progress-note-row-questions';
import ProgressNoteSupervisorNotes from './progress-note-supervisor-notes';
import TimelineCard from './shared/timeline-card';

interface IProps extends IInjectedProps {
  progressNoteId: string;
  patientId: string;
}

interface IGraphqlProps {
  progressNote: FullProgressNote;
  loading?: boolean;
  error?: string | null;
}

type Tab = 'context' | 'activity' | 'supervisor-review';

interface IState {
  tab: Tab | null;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteRow extends React.Component<allProps, IState> {
  state = { tab: null };

  onTabClick = (tab: Tab | null) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { progressNote, patientId, loading, error } = this.props;
    if (loading || error) return null;

    const { tab } = this.state;
    const title = progressNote.progressNoteTemplate ? progressNote.progressNoteTemplate.title : '';

    const tabContainerStyles = classNames(styles.tabs, {
      [styles.tabsNoBorder]: !tab,
    });
    // hide summary when on a tab
    const summary = tab ? null : progressNote.summary;
    const onContextClick = () => this.onTabClick('context');
    const onActivityClick = () => this.onTabClick('activity');
    const onSupervisorReviewClick = () => this.onTabClick('supervisor-review');
    const questionsHtml =
      tab === 'context' ? (
        <ProgressNoteRowQuestions
          goToActivityTab={onActivityClick}
          patientId={patientId}
          progressNote={progressNote}
        />
      ) : null;
    const activityHtml =
      tab === 'activity' ? <ProgressNoteActivity progressNote={progressNote} /> : null;
    const supervisorTab = progressNote.supervisorNotes ? (
      <UnderlineTab
        messageId="progressNote.supervisorReview"
        onClick={onSupervisorReviewClick}
        selected={tab === 'supervisor-review'}
      />
    ) : null;
    const supervisorTabHtml =
      tab === 'supervisor-review' &&
      progressNote.supervisorNotes &&
      progressNote.reviewedBySupervisorAt ? (
        <ProgressNoteSupervisorNotes
          supervisor={progressNote.supervisor}
          reviewedBySupervisorAt={progressNote.reviewedBySupervisorAt}
          supervisorNotes={progressNote.supervisorNotes}
        />
      ) : null;
    const onClose = tab !== null ? () => this.onTabClick(null) : null;

    return (
      <TimelineCard
        source={formatFullName(progressNote.user.firstName, progressNote.user.lastName)}
        sourceDetail={formatCareTeamMemberRole(progressNote.user.userRole)}
        title={title}
        date={progressNote.createdAt}
        notes={summary}
        onClose={onClose}
        progressNote={progressNote}
      >
        <UnderlineTabs color="white" className={tabContainerStyles}>
          <UnderlineTab
            messageId="patient.context"
            onClick={onContextClick}
            selected={tab === 'context'}
          />
          <UnderlineTab
            messageId="patient.activity"
            onClick={onActivityClick}
            selected={tab === 'activity'}
          />
          {supervisorTab}
        </UnderlineTabs>
        {questionsHtml}
        {activityHtml}
        {supervisorTabHtml}
      </TimelineCard>
    );
  }
}

export default compose(
  progressNoteGlassBreak(),
  graphql(progressNoteGraphql, {
    options: (props: IProps) => ({
      variables: {
        progressNoteId: props.progressNoteId,
        glassBreakId: props.glassBreakId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      progressNote: data ? (data as any).progressNote : null,
    }),
  }),
)(ProgressNoteRow) as React.ComponentClass<IProps>;
