import * as classNames from 'classnames';
import { filter, includes } from 'lodash';
import * as React from 'react';
import { Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientCareTeamQuery from '../../../graphql/queries/get-patient-care-team.graphql';
import * as userSummaryListQuery from '../../../graphql/queries/get-user-summary-list.graphql';
import * as patientCareTeamAddUserMutationGraphql from '../../../graphql/queries/patient-care-team-add-user-mutation.graphql';
import {
  getPatientCareTeamQuery,
  getUserSummaryListQuery,
  patientCareTeamAddUserMutation,
  patientCareTeamAddUserMutationVariables,
  UserRole,
} from '../../../graphql/types';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import FormLabel from '../../../shared/library/form-label/form-label';
import ModalButtons from '../../../shared/library/modal-buttons/modal-buttons';
import ModalHeader from '../../../shared/library/modal-header/modal-header';
import OptGroup from '../../../shared/library/optgroup/optgroup';
import Option from '../../../shared/library/option/option';
import Select from '../../../shared/library/select/select';
import { Popup } from '../../../shared/popup/popup';
import * as styles from './css/add-care-team-member-modal.css';

interface IProps {
  isVisible: boolean;
  closePopup: () => void;
  patientId: string;
}

interface IGraphqlProps {
  patientCareTeam?: getPatientCareTeamQuery['patientCareTeam'];
  isPatientCareTeamLoading?: boolean;
  patientCareTeamError?: string;
  userSummaryList?: getUserSummaryListQuery['userSummaryList'];
  isUserSummaryListLoading?: boolean;
  userSummaryListError?: string;
  addUserToPatientCareTeamMutation: (
    options: { variables: patientCareTeamAddUserMutationVariables },
  ) => { data: patientCareTeamAddUserMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  careMemberId: string | null;
  addUserLoading?: boolean;
  addUserError?: string;
  addUserSuccess?: boolean;
  addedCareMember?: patientCareTeamAddUserMutation['careTeamAddUser'];
}

export class AddCareTeamMemberModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { careMemberId: null };
  }

  resetState() {
    this.setState({
      addUserSuccess: false,
      addUserError: undefined,
      addUserLoading: false,
      careMemberId: null,
    });
  }

  handleAddCareTeamMember = async () => {
    const { addUserToPatientCareTeamMutation, patientId } = this.props;
    const { careMemberId } = this.state;

    if (!careMemberId) {
      return;
    }

    try {
      const result = await addUserToPatientCareTeamMutation({
        variables: {
          patientId,
          userId: careMemberId,
        },
      });

      this.setState({
        addUserSuccess: true,
        addedCareMember: result.data.careTeamAddUser,
      });
    } catch (err) {
      this.setState({ addUserError: err.message });
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ [event.target.name as any]: event.target.value });
  };

  handleClose = () => {
    const { closePopup } = this.props;

    closePopup();

    this.resetState();
  };

  handleAddAdditional = () => {
    this.resetState();
  };

  renderUserOptions(careTeamRole: UserRole) {
    const { patientCareTeam, userSummaryList } = this.props;

    if (!patientCareTeam || !userSummaryList) {
      return null;
    }

    const patientCareTeamIds = patientCareTeam.map(user => user.id);

    const validUsers = filter(
      userSummaryList,
      user => !includes(patientCareTeamIds, user.id) && user.userRole === careTeamRole,
    );

    return validUsers.map(user => (
      <Option
        key={`option-${user.id}`}
        value={user.id}
        label={`${formatFullName(user.firstName, user.lastName)} (${user.patientCount})`}
      />
    ));
  }

  renderOptionGroups() {
    const { patientCareTeam, userSummaryList } = this.props;
    const careTeamRoles = Object.keys(UserRole);

    if (!patientCareTeam || !userSummaryList) {
      return;
    }

    return careTeamRoles.map(careTeamRole => (
      <OptGroup messageId={`careWorker.${careTeamRole}`} key={`optgroup-${careTeamRole}`}>
        {this.renderUserOptions(careTeamRole as UserRole)}
      </OptGroup>
    ));
  }

  renderAddUser() {
    const { careMemberId } = this.state;

    return (
      <Fragment>
        <ModalHeader
          titleMessageId="patientTeam.addCareTeamMemberModalHeader"
          bodyMessageId="patientTeam.addCareTeamMemberModalHeaderBody"
          closePopup={this.handleClose}
        />
        <div className={styles.body}>
          <FormLabel messageId="patientTeam.selectCareTeamMember" />
          <Select
            name="careMemberId"
            value={careMemberId || ''}
            onChange={this.handleChange}
            large={true}
          >
            <Option
              disabled={true}
              messageId="patientTeam.addCareTeamMemberSelectPlaceholder"
              value=""
            />
            {this.renderOptionGroups()}
          </Select>
          <ModalButtons
            cancel={this.handleClose}
            submit={this.handleAddCareTeamMember}
            cancelMessageId="patientTeam.cancelAdd"
            submitMessageId="patientTeam.submitAdd"
          />
        </div>
      </Fragment>
    );
  }

  renderAddUserSuccessful() {
    const { addedCareMember } = this.state;

    if (!addedCareMember) {
      return null;
    }

    const addedCareMemberName = formatFullName(addedCareMember.firstName, addedCareMember.lastName);

    const titleText = `${addedCareMemberName} was successfully added`;

    return (
      <div className={styles.addCareTeamMemberModalSuccess}>
        <ModalHeader
          titleText={titleText}
          bodyMessageId="patientTeam.addCareTeamSuccessBodyText"
          closePopup={this.handleClose}
          color="white"
          headerIconName="checkCircle"
          headerIconSize="extraLarge"
          headerIconColor="green"
        />
        <div className={classNames(styles.body, styles.noPaddingTop)}>
          <ModalButtons
            submit={this.handleAddAdditional}
            cancel={this.handleClose}
            submitMessageId="patientTeam.addAdditionalCareTeamMember"
            cancelMessageId="patientTeam.doneAdd"
          />
        </div>
      </div>
    );
  }

  render() {
    const { isVisible } = this.props;
    const { addUserSuccess } = this.state;

    const popupBody = addUserSuccess ? this.renderAddUserSuccessful() : this.renderAddUser();

    return (
      <Popup visible={isVisible} closePopup={this.handleClose} style="no-padding">
        {popupBody}
      </Popup>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(userSummaryListQuery as any, {
    options: (props: IProps) => ({
      variables: {
        userRoleFilters: Object.keys(UserRole),
      },
    }),
    props: ({ data }) => ({
      isUserSummaryListLoading: data ? data.loading : false,
      userSummaryListError: data ? data.error : null,
      userSummaryList: data ? data.userSummaryList : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientCareTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      isPatientCareTeamLoading: data ? data.loading : false,
      patientCareTeamError: data ? data.error : null,
      patientCareTeam: data ? data.patientCareTeam : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientCareTeamAddUserMutationGraphql as any, {
    name: 'addUserToPatientCareTeamMutation',
    options: {
      refetchQueries: ['getPatientCareTeam', 'getUserSummaryList'],
    },
  }),
)(AddCareTeamMemberModal);