import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as patientPanelQuery from '../graphql/queries/get-patient-panel.graphql';
import * as JwtForVcfCreate from '../graphql/queries/jwt-for-vcf-create.graphql';
import { getPatientPanelQuery, JwtForVcfCreateMutation } from '../graphql/types';
import { getContactsVcfRoute } from '../shared/helpers/route-helpers';
import Button from '../shared/library/button/button';
import Icon from '../shared/library/icon/icon';
import MobileHeader from '../shared/library/mobile-header/mobile-header';
import * as styles from './css/contacts-container.css';

interface IGraphqlProps {
  generateJwtForVcf: () => { data: JwtForVcfCreateMutation };
  patientPanel: getPatientPanelQuery['patientPanel'];
  loading?: boolean;
  error?: ApolloError | null;
}

interface IState {
  loading: boolean;
  error: string | null;
}

export class ContactsContainer extends React.Component<IGraphqlProps, IState> {
  constructor(props: IGraphqlProps) {
    super(props);

    this.state = { loading: false, error: null };
  }

  componentDidMount() {
    document.title = 'Download Contacts | Commons';
  }

  handleClick = async (): Promise<void> => {
    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });
        const jwtForVcf = await this.props.generateJwtForVcf();

        window.open(getContactsVcfRoute(jwtForVcf.data.JwtForVcfCreate.authToken));

        this.setState({ loading: false, error: null });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    }
  };

  render(): JSX.Element {
    const { patientPanel, loading, error } = this.props;
    const panelCount = loading || error ? '' : ` ${patientPanel.totalCount}`;

    return (
      <div>
        <MobileHeader messageId="header.contacts" />
        <div className={styles.container}>
          <Icon name="contacts" color="blue" className={styles.icon} />
          <FormattedMessage id="contacts.update">
            {(message: string) => <h1 className={styles.header}>{message}</h1>}
          </FormattedMessage>
          <FormattedMessage id="contacts.info1">
            {(message: string) => (
              <FormattedMessage id="contacts.info2">
                {(message2: string) => (
                  <p className={styles.info}>
                    {`${message}`}
                    <span>{panelCount}</span>
                    {`${message2}`}
                  </p>
                )}
              </FormattedMessage>
            )}
          </FormattedMessage>
          <Button
            messageId="contacts.download"
            onClick={this.handleClick}
            disabled={this.state.loading}
            className={styles.button}
            icon="fileDownload"
          />
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(JwtForVcfCreate as any, {
    name: 'generateJwtForVcf',
  }),
  graphql(patientPanelQuery as any, {
    options: () => ({
      variables: { pageNumber: 0, pageSize: 1, filters: {}, showAllPatients: false },
    }),
    props: ({ data }): Partial<IGraphqlProps> => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientPanel: data ? (data as any).patientPanel : null,
    }),
  }),
)(ContactsContainer);
