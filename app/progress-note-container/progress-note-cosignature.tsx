import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as patientCareTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import {
  getCurrentUserQuery,
  getPatientCareTeamQuery,
  FullProgressNoteFragment,
} from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Option from '../shared/library/option/option';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import Select from '../shared/library/select/select';
import * as styles from './css/progress-note-cosignature.css';
import { IUpdateProgressNoteOptions } from './progress-note-popup';

interface IProps {
  patientId: string | null;
  progressNote?: FullProgressNoteFragment;
  updateProgressNote: (options: IUpdateProgressNoteOptions) => void;
}

interface IGraphqlProps {
  patientCareTeam?: getPatientCareTeamQuery['patientCareTeam'];
  patientCareTeamLoading?: boolean;
  patientCareTeamError?: string | null;
  currentUser?: getCurrentUserQuery['currentUser'];
  error?: string | null;
  loading?: boolean;
}

type allProps = IGraphqlProps & IProps;

export class ProgressNoteCosignature extends React.Component<allProps> {
  onSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { progressNote } = this.props;
    if (progressNote) {
      const value = event.currentTarget.value;
      return await this.props.updateProgressNote({
        progressNoteTemplateId: progressNote.progressNoteTemplate
          ? progressNote.progressNoteTemplate.id
          : null,
        startedAt: progressNote.startedAt,
        location: progressNote.location,
        summary: progressNote.summary,
        memberConcern: progressNote.memberConcern,
        needsSupervisorReview: progressNote.needsSupervisorReview,
        supervisorId: value,
      });
    }
  };

  onRadioChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
    const { progressNote } = this.props;
    if (progressNote) {
      const value = event ? event.currentTarget.value : 'false';
      this.props.updateProgressNote({
        progressNoteTemplateId: progressNote.progressNoteTemplate
          ? progressNote.progressNoteTemplate.id
          : null,
        startedAt: progressNote.startedAt,
        location: progressNote.location,
        summary: progressNote.summary,
        memberConcern: progressNote.memberConcern,
        needsSupervisorReview: value === 'true',
        supervisorId: progressNote.supervisor ? progressNote.supervisor.id : null,
      });
    }
  };

  render() {
    const { patientCareTeam, progressNote, currentUser } = this.props;
    const supervisorId = progressNote && progressNote.supervisor ? progressNote.supervisor.id : '';
    const supervisors = (patientCareTeam || [])
      .map(
        user =>
          user && currentUser && user.id !== currentUser.id && user.firstName ? (
            <Option value={user.id} key={user.id} label={`${user.firstName} ${user.lastName}`} />
          ) : null,
      )
      .filter(Boolean);
    const requiresCosignature = progressNote ? progressNote.needsSupervisorReview : false;
    const supervisor =
      progressNote && progressNote.needsSupervisorReview ? (
        <div className={styles.inputGroup}>
          <FormLabel messageId="progressNote.selectSupervisor" />
          <Select value={supervisorId} onChange={this.onSelectChange}>
            <Option value={''} disabled={true} messageId="progressNote.selectSupervisor" />
            {supervisors}
          </Select>
        </div>
      ) : null;
    return (
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <FormLabel messageId="progressNote.doesRequireCosignature" />
          <RadioGroup>
            <RadioInput
              value="true"
              checked={!!requiresCosignature}
              label="Yes"
              onChange={this.onRadioChange}
            />
            <RadioInput
              value="false"
              checked={!requiresCosignature}
              label="No"
              onChange={this.onRadioChange}
            />
          </RadioGroup>
        </div>
        {supervisor}
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientCareTeamQuery as any, {
    skip: (props: IProps) => !props.patientId,
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientCareTeamLoading: data ? data.loading : false,
      patientCareTeamError: data ? data.error : null,
      patientCareTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(ProgressNoteCosignature);
