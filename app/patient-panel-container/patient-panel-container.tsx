import { History } from 'history';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as patientPanelQuery from '../graphql/queries/get-patient-panel.graphql';
import { getCurrentUserQuery, ShortPatientFragment } from '../graphql/types';
import Button from '../shared/library/button/button';
import * as styles from './css/patient-panel.css';
import PatientFilterPanel from './patient-filter-panel';
import { PatientRoster } from './patient-roster';

export interface IPageParams {
  pageNumber: number;
  pageSize: number;
}

export interface IPatientPanelPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPatientPanelNode {
  node: ShortPatientFragment;
}

export interface IPatientPanel {
  edges: IPatientPanelNode[];
  pageInfo: IPatientPanelPageInfo;
}

interface IGraphqlProps {
  refetchPatientPanel: (variables: { pageNumber: number; pageSize: number }) => void;
  loading: boolean;
  error: string | null;
  patientPanel?: IPatientPanel;
  currentUser?: getCurrentUserQuery['currentUser'];
}

interface IProps {
  mutate?: any;
  history: History;
}

type allProps = IGraphqlProps & IProps;

interface IState extends IPageParams {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isPanelOpen: boolean | null;
}

class PatientPanelContainer extends React.Component<allProps, IState> {
  title = 'Patient roster';

  constructor(props: allProps) {
    super(props);

    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
    this.formattedPatients = this.formattedPatients.bind(this);
    this.reloadCurrentPage = this.reloadCurrentPage.bind(this);

    const pageParams = getPageParams();
    this.state = {
      pageNumber: pageParams.pageNumber || 0,
      pageSize: pageParams.pageSize || 10,
      isPanelOpen: null,
    };
  }

  async getNextPage() {
    if (this.state.hasNextPage) {
      const pageNumber = this.state.pageNumber + 1;

      this.props.refetchPatientPanel({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.updatePageParams(pageNumber);
      this.setState({ pageNumber });
    }
  }

  async getPreviousPage() {
    if (this.state.hasPreviousPage) {
      const pageNumber = this.state.pageNumber - 1;

      await this.props.refetchPatientPanel({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.updatePageParams(pageNumber);
      this.setState({ pageNumber });
    }
  }

  async reloadCurrentPage() {
    await this.props.refetchPatientPanel({
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,
    });
  }

  formattedPatients() {
    return this.props.patientPanel ? this.props.patientPanel.edges.map(edge => edge.node) : [];
  }

  componentWillReceiveProps(nextProps: allProps) {
    if (nextProps.patientPanel) {
      const { hasNextPage, hasPreviousPage } = nextProps.patientPanel.pageInfo;

      this.setState({ hasNextPage, hasPreviousPage });
    }
  }

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  goToIntake = () => this.props.history.push('/patient-intake');

  handleFilterClick = () => {
    this.setState({ isPanelOpen: true });
  };

  handleFilterCancelClick = () => {
    this.setState({ isPanelOpen: false });
  };

  updatePageParams = (pageNumber: number) => {
    const pageParams = getPageParams();
    pageParams.pageNumber = pageNumber;

    this.props.history.push({ search: querystring.stringify(pageParams) });
  };

  render() {
    const { error, loading, currentUser } = this.props;
    const { isPanelOpen } = this.state;
    const isAdmin = currentUser && currentUser.userRole === 'admin';

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.headerText}>
              <FormattedMessage id="patientPanel.header">
                {(message: string) => <div className={styles.headerTitle}>{message}</div>}
              </FormattedMessage>
              <FormattedMessage id="patientPanel.description">
                {(message: string) => <div className={styles.headerDescription}>{message}</div>}
              </FormattedMessage>
            </div>
            <div>
              <Button
                messageId="patientPanel.filter"
                onClick={this.handleFilterClick}
                className={styles.button}
              />
              {isAdmin && (
                <Button
                  messageId="patientPanel.addPatient"
                  onClick={this.goToIntake}
                  className={styles.button}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.patientPanelBody}>
          <PatientRoster
            isLoading={loading}
            error={error}
            patients={this.formattedPatients()}
            onRetryClick={this.reloadCurrentPage}
            hasNextPage={this.state.hasNextPage}
            hasPreviousPage={this.state.hasPreviousPage}
            onNextClick={this.getNextPage}
            onPreviousClick={this.getPreviousPage}
          />
        </div>
        <PatientFilterPanel onCancelClick={this.handleFilterCancelClick} isVisible={isPanelOpen} />
      </div>
    );
  }
}

const getPageParams = (): IPageParams => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: Number(pageParams.pageNumber || 0),
    pageSize: Number(pageParams.pageSize || 10),
  };
};

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(patientPanelQuery as any, {
    options: () => ({
      variables: getPageParams(),
    }),
    props: ({ data }) => ({
      refetchPatientPanel: data ? data.refetch : null,
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientPanel: data ? (data as any).userPatientPanel : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(currentUserQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(PatientPanelContainer);
