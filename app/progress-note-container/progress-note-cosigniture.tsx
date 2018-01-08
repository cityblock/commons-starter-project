import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientCareTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import { getPatientCareTeamQuery, FullProgressNoteFragment } from '../graphql/types';
import FormLabel from '../shared/library/form-label/form-label';
import Option from '../shared/library/option/option';
import RadioGroup from '../shared/library/radio-group/radio-group';
import RadioInput from '../shared/library/radio-input/radio-input';
import Select from '../shared/library/select/select';
import * as styles from './css/progress-note-cosigniture.css';
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
}

type allProps = IGraphqlProps & IProps;

export class ProgressNoteCosigniture extends React.Component<allProps> {
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
    const { patientCareTeam, progressNote } = this.props;
    const supervisorId = progressNote && progressNote.supervisor ? progressNote.supervisor.id : '';
    const supervisors = (patientCareTeam || [])
      .map(
        user =>
          user ? (
            <Option value={user.id} key={user.id} label={`${user.firstName} ${user.lastName}`} />
          ) : null,
      )
      .filter(Boolean);
    const requiresCosigniture = progressNote ? progressNote.needsSupervisorReview : false;
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
          <FormLabel messageId="progressNote.doesRequireCosigniture" />
          <RadioGroup>
            <RadioInput
              value="true"
              checked={!!requiresCosigniture}
              label="Yes"
              onChange={this.onRadioChange}
            />
            <RadioInput
              value="false"
              checked={!requiresCosigniture}
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

export default graphql<IGraphqlProps, IProps, allProps>(patientCareTeamQuery as any, {
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
})(ProgressNoteCosigniture);
