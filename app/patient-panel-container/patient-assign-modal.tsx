import React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import careTeamAssignPatientsGraphql from '../graphql/queries/care-team-assign-patients-mutation.graphql';
import getPatientPanel from '../graphql/queries/get-patient-panel.graphql';
import {
  careTeamAssignPatients,
  careTeamAssignPatientsVariables,
  PatientFilterOptions,
} from '../graphql/types';
import { formatFullName } from '../shared/helpers/format-helpers';
import FormLabel from '../shared/library/form-label/form-label';
import Modal from '../shared/library/modal/modal';
import CareWorkerSelect from './care-worker-select';
import styles from './css/patient-assign-modal.css';

export interface IPatientState {
  [key: string]: boolean;
}

interface IProps {
  isVisible: boolean;
  closePopup: () => void; // for use when clicking cancel and X icon
  patientSelectState: IPatientState;
  filters: PatientFilterOptions;
  showAllPatients: boolean;
  pageNumber: number;
  pageSize: number;
}

interface IGraphqlProps {
  careTeamAssignPatients: (
    options: { variables: careTeamAssignPatientsVariables },
  ) => { data: careTeamAssignPatients };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  careWorkerId: string | null;
  assignLoading: boolean;
  assignError: string | null;
  assignSuccess?: boolean;
  assignedCareWorker: careTeamAssignPatients['careTeamAssignPatients'];
}

class PatientAssignModal extends React.Component<allProps, IState> {
  state: IState = {
    careWorkerId: null,
    assignError: null,
    assignLoading: false,
    assignedCareWorker: { id: '', firstName: '', lastName: '', patientCount: 0 },
  };

  handleAssignMembers = async () => {
    const { patientSelectState } = this.props;
    const { careWorkerId } = this.state;
    const patientIds = filterPatientState(patientSelectState);

    if (!careWorkerId) {
      return;
    }

    try {
      this.setState({ assignLoading: true });
      const result = await this.props.careTeamAssignPatients({
        variables: {
          patientIds,
          userId: careWorkerId,
        },
      });

      this.setState({
        assignSuccess: true,
        assignLoading: false,
        assignedCareWorker: result.data.careTeamAssignPatients,
      });
    } catch (err) {
      this.setState({ assignError: err.message, assignLoading: false });
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ [event.target.name as any]: event.target.value } as any);
  };

  handleClose = () => {
    const { closePopup } = this.props;
    closePopup();
    this.setState({
      assignSuccess: false,
      assignError: null,
      assignLoading: false,
      careWorkerId: null,
    });
  };

  renderSaveSuccessfulBody() {
    const { patientSelectState } = this.props;
    const { assignedCareWorker } = this.state;
    const numberSelected = filterPatientState(patientSelectState).length;
    const hasWorker = assignedCareWorker && assignedCareWorker.id !== '';
    let assignedMessageId = 'patientAssignModal.assignSuccessDetailSingular';
    if (numberSelected > 1) {
      assignedMessageId = 'patientAssignModal.assignSuccessDetailPlural';
    }

    return (
      <React.Fragment>
        <FormattedMessage id={assignedMessageId}>
          {(message: string) => (
            <div className={styles.padding}>
              <span className={styles.blueHighlight}>{numberSelected}</span> {message}
            </div>
          )}
        </FormattedMessage>
        {hasWorker && (
          <div className={styles.box}>
            {formatFullName(assignedCareWorker!.firstName, assignedCareWorker!.lastName)}
            <span className={styles.blueHighlight}> ({assignedCareWorker!.patientCount})</span>
          </div>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { careWorkerId, assignError, assignLoading, assignSuccess } = this.state;

    const bodyHtml = assignSuccess ? (
      this.renderSaveSuccessfulBody()
    ) : (
      <React.Fragment>
        <FormLabel messageId="patientAssignModal.select" />
        <CareWorkerSelect onChange={this.handleChange} value={careWorkerId} isLarge={true} />
      </React.Fragment>
    );

    const title = assignSuccess
      ? 'patientAssignModal.assignSuccessTitle'
      : 'patientAssignModal.title';
    const subtitle = assignSuccess ? undefined : 'patientAssignModal.description';

    return (
      <Modal
        titleMessageId={title}
        subTitleMessageId={subtitle}
        cancelMessageId="patientAssignModal.cancel"
        submitMessageId="patientAssignModal.assign"
        onClose={this.handleClose}
        onSubmit={this.handleAssignMembers}
        isVisible={isVisible}
        isLoading={assignLoading}
        error={assignError}
      >
        {bodyHtml}
      </Modal>
    );
  }
}

export function filterPatientState(patientSelectState: object): string[] {
  return Object.keys(patientSelectState).filter(key => {
    const states = patientSelectState as any;
    return !!states[key];
  });
}

export default graphql<any>(careTeamAssignPatientsGraphql, {
  name: 'careTeamAssignPatients',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientPanel,
        variables: {
          pageNumber: props.pageNumber,
          pageSize: props.pageSize,
          filters: props.filters,
          showAllPatients: props.showAllPatients,
        },
      },
    ],
  }),
})(PatientAssignModal) as React.ComponentClass<IProps>;
