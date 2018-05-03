import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as mattermostUrlForUserCreate from '../../graphql/queries/mattermost-url-for-user-create.graphql';
import {
  mattermostUrlForUserCreateMutation,
  mattermostUrlForUserCreateMutationVariables,
} from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/care-team-member-contact.css';

interface IProps {
  careTeamMemberId: string;
  firstName: string;
  email: string;
  isVisible: boolean;
}

interface IGraphqlProps {
  getMattermostLink: (
    options: { variables: mattermostUrlForUserCreateMutationVariables },
  ) => { data: mattermostUrlForUserCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  loading: boolean;
  error: string | null;
}

export class CareTeamMemberContact extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { loading: false, error: null };
  }

  handleMessageClick = async (): Promise<void> => {
    const { email, getMattermostLink } = this.props;

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const mattermostUrl = await getMattermostLink({ variables: { email } });

        window.open(mattermostUrl.data.mattermostUrlForUserCreate.url, '_blank');

        this.setState({ loading: false });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    const { firstName, isVisible } = this.props;

    const containerStyles = classNames(styles.container, {
      [styles.collapsed]: !isVisible,
      [styles.expanded]: isVisible,
    });

    return (
      <div className={containerStyles} onClick={e => e.stopPropagation()}>
        <div className={styles.flex}>
          <Icon name="phone" color="black" className={styles.icon} />
          <SmallText
            messageId="careTeam.call"
            messageValues={{ name: firstName }}
            color="black"
            size="medium"
          />
        </div>
        <div className={styles.flex} onClick={this.handleMessageClick}>
          <Icon name="mattermost" className={styles.icon} />
          <SmallText
            messageId="careTeam.mattermost"
            messageValues={{ name: firstName }}
            color="black"
            size="medium"
          />
        </div>
      </div>
    );
  }
}

export default graphql<any>(mattermostUrlForUserCreate as any, {
  name: 'getMattermostLink',
})(CareTeamMemberContact) as React.ComponentClass<IProps>;
