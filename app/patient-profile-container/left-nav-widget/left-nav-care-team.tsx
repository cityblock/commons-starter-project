import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
import { getPatientCareTeamQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import CareTeamMember from './care-team-member';
import * as styles from './css/left-nav-care-team.css';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  careTeam: getPatientCareTeamQuery['patientCareTeam'];
}

type allProps = IProps & IGraphqlProps;

interface IState {
  selectedCareTeamMemberId: string | null;
}

export class LeftNavCareTeam extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { selectedCareTeamMemberId: null };
  }

  handleClick = (careTeamMemberId: string): void => {
    const { selectedCareTeamMemberId } = this.state;

    if (selectedCareTeamMemberId === careTeamMemberId) {
      this.setState({ selectedCareTeamMemberId: null });
    } else {
      this.setState({ selectedCareTeamMemberId: careTeamMemberId });
    }
  };

  render(): JSX.Element {
    const { loading, error, careTeam } = this.props;
    const { selectedCareTeamMemberId } = this.state;

    if (loading || error) return <Spinner />;

    const careTeamMembers = careTeam.map((member, i) => (
      <CareTeamMember
        key={member.id}
        careTeamMember={member}
        handleClick={this.handleClick}
        isSelected={member.id === selectedCareTeamMemberId}
        isLead={member.isCareTeamLead}
      />
    ));

    return <div className={styles.container}>{careTeamMembers}</div>;
  }
}

export default graphql(careTeamQuery as any, {
  options: (props: IProps) => ({
    variables: { patientId: props.patientId },
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    careTeam: data ? (data as any).patientCareTeam : null,
  }),
})(LeftNavCareTeam);
