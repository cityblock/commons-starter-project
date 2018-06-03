import * as React from 'react';
import { graphql } from 'react-apollo';
import * as mattermostUrlForPatientCreate from '../../graphql/queries/mattermost-url-for-patient-create.graphql';
import {
  mattermostUrlForPatientCreateMutation,
  mattermostUrlForPatientCreateMutationVariables,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/care-team-member.css';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  getMattermostLink: (
    options: { variables: mattermostUrlForPatientCreateMutationVariables },
  ) => { data: mattermostUrlForPatientCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class CareTeamMattermost extends React.Component<allProps, IState> {
  state = { loading: false, error: null };

  handleClick = async (): Promise<void> => {
    const { patientId, getMattermostLink } = this.props;

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const mattermostUrl = await getMattermostLink({ variables: { patientId } });

        window.open(mattermostUrl.data.mattermostUrlForPatientCreate.url, '_blank');

        this.setState({ loading: false });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    return (
      <div onClick={this.handleClick}>
        <div className={styles.container}>
          <div className={styles.user}>
            <div className={styles.iconContainer}>
              <Icon name="people" color="blue" />
            </div>
            <div className={styles.detail}>
              <SmallText
                messageId="careTeam.chat"
                isBold
                size="largest"
                color="black"
                className={styles.bottomMargin}
              />
              <SmallText messageId="careTeam.chatDetail" size="large" color="black" />
            </div>
          </div>
        </div>
        <div className={styles.divider} />
      </div>
    );
  }
}

export default graphql<any>(mattermostUrlForPatientCreate as any, {
  name: 'getMattermostLink',
})(CareTeamMattermost) as React.ComponentClass<IProps>;
