import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientCareTeamQuery from '../../../graphql/queries/get-patient-care-team.graphql';
import { getPatientCareTeamQuery, FullCareTeamUserFragment } from '../../../graphql/types';
import { AddCareTeamMemberModalFilters } from '../patient-team';
import CareTeamMember from './care-team-member';
import * as styles from './css/patient-cityblock-care-team.css';
import RemoveCareTeamMemberModal from './remove-care-team-member-modal';
import RequiredTeamMember from './required-team-member';

interface IProps {
  patientId: string;
  onAddCareTeamMember: (filter: AddCareTeamMemberModalFilters) => void;
}

interface IGraphqlProps {
  patientCareTeam?: getPatientCareTeamQuery['patientCareTeam'];
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isRemoveModalVisible: boolean;
  careTeamMemberToRemove?: FullCareTeamUserFragment | null;
}

export class PatientCityblockCareTeam extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { isRemoveModalVisible: false };
  }

  onShowRemoveModal = (careTeamMemberToRemove: FullCareTeamUserFragment) => {
    this.setState({ isRemoveModalVisible: true, careTeamMemberToRemove });
  };

  onHideRemoveModal = () => {
    this.setState({ isRemoveModalVisible: false, careTeamMemberToRemove: null });
  };

  renderCareTeamMembers() {
    const { patientCareTeam, isLoading, patientId } = this.props;
    const careTeam = patientCareTeam || [];

    if (isLoading || !careTeam.length) {
      return null;
    }

    return careTeam.map(careTeamMember => (
      <CareTeamMember
        key={careTeamMember.id}
        patientId={patientId}
        careTeamMember={careTeamMember}
        onClickToRemove={this.onShowRemoveModal}
      />
    ));
  }

  render(): JSX.Element {
    const { patientCareTeam, isLoading, patientId, onAddCareTeamMember } = this.props;
    const { isRemoveModalVisible, careTeamMemberToRemove } = this.state;

    return (
      <div className={styles.container}>
        <RequiredTeamMember
          patientCareTeam={patientCareTeam}
          isLoading={isLoading}
          requiredRoleType="communityHealthPartner"
          onClick={() => onAddCareTeamMember('communityHealthPartner')}
        />
        <RequiredTeamMember
          patientCareTeam={patientCareTeam}
          isLoading={isLoading}
          requiredRoleType="primaryCarePhysician"
          onClick={() => onAddCareTeamMember('primaryCarePhysician')}
        />
        {this.renderCareTeamMembers()}
        <RemoveCareTeamMemberModal
          patientId={patientId}
          closePopup={this.onHideRemoveModal}
          isVisible={isRemoveModalVisible}
          careTeamMember={careTeamMemberToRemove}
          careTeam={patientCareTeam}
        />
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(patientCareTeamQuery as any, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }) => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientCareTeam: data ? (data as any).patientCareTeam : null,
  }),
})(PatientCityblockCareTeam);
