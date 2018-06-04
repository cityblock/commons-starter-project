import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as userVoicemailSignedUrlCreate from '../graphql/queries/user-voicemail-signed-url-create.graphql';
import {
  userVoicemailSignedUrlCreateMutation,
  userVoicemailSignedUrlCreateMutationVariables,
} from '../graphql/types';
import Icon from '../shared/library/icon/icon';
import MobileHeader from '../shared/library/mobile-header/mobile-header';
import * as styles from './css/voicemail-container.css';

interface IProps {
  match?: {
    params: {
      voicemailId: string;
    };
  };
}

interface IGraphqlProps {
  getSignedVoicemailUrl: (
    options: { variables: userVoicemailSignedUrlCreateMutationVariables },
  ) => { data: userVoicemailSignedUrlCreateMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  error: string | null;
}

export class VoicemailContainer extends React.Component<allProps, IState> {
  state = { error: null };

  async componentDidMount(): Promise<void> {
    const { getSignedVoicemailUrl, match } = this.props;

    if (match && match.params) {
      try {
        const signedUrlData = await getSignedVoicemailUrl({
          variables: { voicemailId: match.params.voicemailId },
        });

        if (signedUrlData.data.userVoicemailSignedUrlCreate.signedUrl) {
          window.open(signedUrlData.data.userVoicemailSignedUrlCreate.signedUrl, '_self');
        }
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
  }

  render(): JSX.Element {
    return (
      <div className={styles.container}>
        <MobileHeader messageId="header.voicemail" />
        <div className={styles.body}>
          <Icon name="contactPhone" color="blue" className={styles.icon} />
          <FormattedMessage id="voicemail.loading">
            {(message: string) => <h1 className={styles.header}>{message}</h1>}
          </FormattedMessage>
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(userVoicemailSignedUrlCreate as any, {
  name: 'getSignedVoicemailUrl',
})(VoicemailContainer);
