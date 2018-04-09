import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as careTeamAssignPatientsMutationGraphql from '../graphql/queries/care-team-assign-patients-mutation.graphql';
import {
  careTeamAssignPatientsMutation,
  careTeamAssignPatientsMutationVariables,
} from '../graphql/types';
import { formatFullName } from '../shared/helpers/format-helpers';
import FormLabel from '../shared/library/form-label/form-label';
import ModalButtons from '../shared/library/modal-buttons/modal-buttons';
import ModalError from '../shared/library/modal-error/modal-error';
import ModalHeader from '../shared/library/modal-header/modal-header';
import { Popup } from '../shared/popup/popup';
import CareWorkerSelect from './care-worker-select';
import * as styles from './css/patient-assign-modal.css';

export interface IPatientState {
  [key: string]: boolean;
}

interface IProps {
  isVisible: boolean;
  closePopup: () => void; // for use when clicking cancel and X icon
  patientSelectState: IPatientState;
}

interface IGraphqlProps {
  careTeamAssignPatients: (
    options: { variables: careTeamAssignPatientsMutationVariables },
  ) => { data: careTeamAssignPatientsMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  careWorkerId: string | null;
  assignLoading?: boolean;
  assignError: string | null;
  assignSuccess?: boolean;
  assignedCareWorker: careTeamAssignPatientsMutation['careTeamAssignPatients'];
}

class PatientAssignModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      careWorkerId: null,
      assignError: null,
      assignedCareWorker: { id: '', firstName: '', lastName: '', patientCount: 0 },
    };
  }

  handleAssignMembers = async () => {
    const { careTeamAssignPatients, patientSelectState } = this.props;
    const { careWorkerId } = this.state;
    const patientIds = filterPatientState(patientSelectState);

    if (!careWorkerId) {
      return;
    }

    try {
      const result = await careTeamAssignPatients({
        variables: {
          patientIds,
          userId: careWorkerId,
        },
      });

      this.setState({
        assignSuccess: true,
        assignedCareWorker: result.data.careTeamAssignPatients,
      });
    } catch (err) {
      this.setState({ assignError: err.message });
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({ [event.target.name as any]: event.target.value });
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

  renderAssign() {
    const { careWorkerId, assignError } = this.state;
    const errorComponent = assignError ? <ModalError error={assignError} /> : null;

    return (
      <div>
        <ModalHeader
          titleMessageId="patientAssignModal.title"
          bodyMessageId="patientAssignModal.description"
          closePopup={this.handleClose}
        />
        {errorComponent}
        <div className={styles.body}>
          <FormLabel messageId="patientAssignModal.select" />
          <CareWorkerSelect onChange={this.handleChange} value={careWorkerId} isLarge={true} />
          <ModalButtons
            cancel={this.handleClose}
            submit={this.handleAssignMembers}
            cancelMessageId="patientAssignModal.cancel"
            submitMessageId="patientAssignModal.assign"
          />
        </div>
      </div>
    );
  }

  renderSaveSuccessful() {
    const { patientSelectState } = this.props;
    const { assignedCareWorker } = this.state;
    const numberSelected = filterPatientState(patientSelectState).length;
    const hasWorker = assignedCareWorker && assignedCareWorker.id !== '';
    let assignedMessageId = 'patientAssignModal.assignSuccessDetailSingular';
    if (numberSelected > 1) {
      assignedMessageId = 'patientAssignModal.assignSuccessDetailPlural';
    }

    return (
      <div>
        <ModalHeader
          titleMessageId="patientAssignModal.assignSuccessTitle"
          closePopup={this.handleClose}
          color="white"
        >
          <FormattedMessage id={assignedMessageId}>
            {(message: string) => (
              <div>
                <span className={styles.blueHighlight}>{numberSelected}</span> {message}
              </div>
            )}
          </FormattedMessage>
        </ModalHeader>
        <div className={styles.body}>
          {hasWorker && (
            <div className={styles.box}>
              {formatFullName(assignedCareWorker!.firstName, assignedCareWorker!.lastName)}
              <span className={styles.blueHighlight}> ({assignedCareWorker!.patientCount})</span>
            </div>
          )}
          <ModalButtons submit={this.handleClose} submitMessageId="patientAssignModal.done" />
        </div>
      </div>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { assignSuccess } = this.state;

    return (
      <Popup visible={isVisible} closePopup={this.handleClose} style="no-padding">
        {assignSuccess && this.renderSaveSuccessful()}
        {!assignSuccess && this.renderAssign()}
      </Popup>
    );
  }
}

export function filterPatientState(patientSelectState: object): string[] {
  return Object.keys(patientSelectState).filter(key => {
    const states = patientSelectState as any;
    return !!states[key];
  });
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(careTeamAssignPatientsMutationGraphql as any, {
    name: 'careTeamAssignPatients',
    options: {
      refetchQueries: ['getPatientPanel'],
    },
  }),
)(PatientAssignModal);
