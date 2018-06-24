import classNames from 'classnames';
import { filter, includes, sortBy } from 'lodash';
import React from 'react';
import { Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import getPatientCareTeamGraphql from '../../../graphql/queries/get-patient-care-team.graphql';
import getPatientGraphql from '../../../graphql/queries/get-patient.graphql';
import getUserSummaryListGraphql from '../../../graphql/queries/get-user-summary-list.graphql';
import patientCareTeamAddUserGraphql from '../../../graphql/queries/patient-care-team-add-user-mutation.graphql';
import {
  getPatientCareTeam,
  getUserSummaryList,
  patientCareTeamAddUser,
  patientCareTeamAddUserVariables,
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
import { AddCareTeamMemberModalFilters } from '../patient-team';
import styles from './css/add-care-team-member-modal.css';

interface IProps {
  isVisible: boolean;
  closePopup: () => void;
  patientId: string;
  careWorkerRolesFilter?: AddCareTeamMemberModalFilters | null;
}

interface IGraphqlProps {
  patientCareTeam?: getPatientCareTeam['patientCareTeam'];
  isPatientCareTeamLoading?: boolean;
  patientCareTeamError?: string;
  userSummaryList?: getUserSummaryList['userSummaryList'];
  isUserSummaryListLoading?: boolean;
  userSummaryListError?: string;
  addUserToPatientCareTeam: (
    options: { variables: patientCareTeamAddUserVariables },
  ) => { data: patientCareTeamAddUser };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  careMemberId: string | null;
  addUserLoading?: boolean;
  addUserError?: string;
  addUserSuccess?: boolean;
  addedCareMember?: patientCareTeamAddUser['careTeamAddUser'];
}

export class AddCareTeamMemberModal extends React.Component<allProps, IState> {
  state: IState = { careMemberId: null };

  resetState() {
    this.setState({
      addUserSuccess: false,
      addUserError: undefined,
      addUserLoading: false,
      careMemberId: null,
    });
  }

  handleAddCareTeamMember = async () => {
    const { addUserToPatientCareTeam, patientId } = this.props;
    const { careMemberId } = this.state;

    if (!careMemberId) {
      return;
    }

    try {
      const result = await addUserToPatientCareTeam({
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
    this.setState({ [event.target.name as any]: event.target.value } as any);
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

    if (!validUsers.length) {
      return (
        <Option
          disabled={true}
          key={`option-${careTeamRole}-none-available`}
          messageId="patientTeam.addCareTeamMemberNoneAvailable"
          value=""
        />
      );
    }

    return validUsers.map(user => (
      <Option
        key={`option-${user.id}`}
        value={user.id}
        label={`${formatFullName(user.firstName, user.lastName)} (${user.patientCount})`}
      />
    ));
  }

  renderOptionGroups() {
    const { patientCareTeam, userSummaryList, careWorkerRolesFilter } = this.props;
    const careTeamRoles = Object.keys(UserRole);

    if (!patientCareTeam || !userSummaryList) {
      return;
    }

    if (careWorkerRolesFilter) {
      return (
        <OptGroup
          messageId={`careWorker.${careWorkerRolesFilter}`}
          key={`optgroup-${careWorkerRolesFilter}`}
        >
          {this.renderUserOptions(careWorkerRolesFilter as UserRole)}
        </OptGroup>
      );
    }

    // Note: _.sortBy without a second argument, just does a default sort
    return sortBy(careTeamRoles).map(careTeamRole => (
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
    const { careWorkerRolesFilter } = this.props;

    if (!addedCareMember) {
      return null;
    }

    const addedCareMemberName = formatFullName(addedCareMember.firstName, addedCareMember.lastName);
    const titleText = `${addedCareMemberName} was successfully added`;
    const buttonsHtml = !!careWorkerRolesFilter ? (
      <ModalButtons cancel={this.handleClose} cancelMessageId="patientTeam.doneAdd" />
    ) : (
      <ModalButtons
        submit={this.handleAddAdditional}
        cancel={this.handleClose}
        submitMessageId="patientTeam.addAdditionalCareTeamMember"
        cancelMessageId="patientTeam.doneAdd"
      />
    );
    const bodyMessageId = !!careWorkerRolesFilter
      ? 'patientTeam.addCareTeamSuccessBodyTextNoAddAdditional'
      : 'patientTeam.addCareTeamSuccessBodyText';

    return (
      <div className={styles.addCareTeamMemberModalSuccess}>
        <ModalHeader
          titleText={titleText}
          bodyMessageId={bodyMessageId}
          closePopup={this.handleClose}
          color="white"
          headerIconName="checkCircle"
          headerIconSize="extraLarge"
          headerIconColor="green"
        />
        <div className={classNames(styles.body, styles.noPaddingTop)}>{buttonsHtml}</div>
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
  graphql(getUserSummaryListGraphql, {
    options: (props: IProps) => ({
      variables: {
        userRoleFilters: Object.keys(UserRole),
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      isUserSummaryListLoading: data ? data.loading : false,
      userSummaryListError: data ? data.error : null,
      userSummaryList: data ? (data as any).userSummaryList : null,
    }),
  }),
  graphql(getPatientCareTeamGraphql, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      isPatientCareTeamLoading: data ? data.loading : false,
      patientCareTeamError: data ? data.error : null,
      patientCareTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
  graphql(patientCareTeamAddUserGraphql, {
    name: 'addUserToPatientCareTeam',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: getUserSummaryListGraphql,
          variables: {
            userRoleFilters: Object.keys(UserRole),
          },
        },
        {
          query: getPatientCareTeamGraphql,
          variables: {
            patientId: props.patientId,
          },
        },
        {
          query: getPatientGraphql,
          variables: {
            patientId: props.patientId,
          },
        },
      ],
    }),
  }),
)(AddCareTeamMemberModal) as React.ComponentClass<IProps>;
