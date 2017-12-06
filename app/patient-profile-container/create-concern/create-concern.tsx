import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { closePopup } from '../../actions/popup-action';
/* tslint:disable:max-line-length */
import * as patientConcernCreateMutationGraphql from '../../graphql/queries/patient-concern-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  patientConcernCreateMutation,
  patientConcernCreateMutationVariables,
} from '../../graphql/types';
import { ICreatePatientConcernPopupOptions } from '../../reducers/popup-reducer';
import ModalButtons from '../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../shared/library/modal-header/modal-header';
import { Popup } from '../../shared/popup/popup';
import { IState as IAppState } from '../../store';
import ConcernSearch from './concern-search';
import * as styles from './css/create-concern.css';

interface IPatientConcernCreateOptions {
  variables: patientConcernCreateMutationVariables;
}

interface IStateProps {
  visible: boolean;
  patientId: string;
}

interface IDispatchProps {
  closePopup: () => void;
}

interface IGraphqlProps {
  createPatientConcern?: (
    options: IPatientConcernCreateOptions,
  ) => { data: patientConcernCreateMutation };
}

type ConcernType = 'active' | 'inactive';

interface IState {
  concernId?: string;
  concernType?: ConcernType;
  searchTerm: string;
  hideSearchResults: boolean;
  showAllConcerns: boolean;
  concernCreateError?: string;
}

type allProps = IStateProps & IDispatchProps & IGraphqlProps;

export class CreateConcernModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): IState {
    return {
      concernId: undefined,
      concernType: undefined,
      searchTerm: '',
      hideSearchResults: false,
      showAllConcerns: false,
      concernCreateError: undefined,
    };
  }

  onClose = (): void => {
    this.props.closePopup();
    this.setState(this.getInitialState());
  };

  onSubmit = async (): Promise<void> => {
    const { createPatientConcern, patientId } = this.props;
    const { concernId, concernType } = this.state;

    if (createPatientConcern && concernId) {
      try {
        this.setState({ concernCreateError: undefined });
        const startedAt = concernType === 'active' ? new Date().toISOString() : null;
        await createPatientConcern({ variables: { patientId, concernId, startedAt } });
        this.onClose();
      } catch (err) {
        this.setState({ concernCreateError: err.message });
      }
    }
  };

  onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const concernType = e.currentTarget.value as ConcernType;
    this.setState({ concernType });
  };

  onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      searchTerm: e.currentTarget.value,
      concernId: undefined,
      hideSearchResults: false,
    });
  };

  onSearchTermClick = (concernId: string, concernTitle: string): void => {
    this.setState({
      concernId,
      searchTerm: concernTitle,
      hideSearchResults: true,
      showAllConcerns: false,
    });
  };

  toggleShowAllConcerns = (): void => {
    this.setState((prevState: IState) => ({ showAllConcerns: !prevState.showAllConcerns }));
  };

  render(): JSX.Element {
    const { visible, patientId } = this.props;
    const { concernId, concernType, hideSearchResults, searchTerm, showAllConcerns } = this.state;

    return (
      <Popup
        visible={visible}
        closePopup={this.onClose}
        style="no-padding"
        className={styles.popup}
      >
        <ModalHeader
          titleMessageId="concernCreate.title"
          bodyMessageId="concernCreate.detail"
          closePopup={this.onClose}
        />
        <div className={styles.fields}>
          <ConcernSearch
            patientId={patientId}
            concernId={concernId}
            concernType={concernType}
            hideSearchResults={hideSearchResults}
            onSearchTermChange={this.onSearchTermChange}
            onSearchTermClick={this.onSearchTermClick}
            onSelectChange={this.onSelectChange}
            searchTerm={searchTerm}
            showAllConcerns={showAllConcerns}
            toggleShowAllConcerns={this.toggleShowAllConcerns}
          />
          <ModalButtons
            cancelMessageId="concernCreate.cancel"
            submitMessageId="concernCreate.submit"
            cancel={this.onClose}
            submit={this.onSubmit}
          />
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const visible = state.popup.name === 'CREATE_PATIENT_CONCERN';
  const patientId = visible
    ? (state.popup.options as ICreatePatientConcernPopupOptions).patientId
    : '';

  return { visible, patientId };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => ({
  closePopup: () => dispatch(closePopup()),
});

export default compose(
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, {}, allProps>(patientConcernCreateMutationGraphql as any, {
    name: 'createPatientConcern',
    options: {
      refetchQueries: ['getPatientCarePlan'],
    },
  }),
)(CreateConcernModal);
