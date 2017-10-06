import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as patientPanelQuery from '../graphql/queries/get-patient-panel.graphql';
import { ShortPatientFragment } from '../graphql/types';
import * as styles from './css/patient-panel.css';
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

interface IProps {
  refetchPatientPanel: (variables: { pageNumber: number, pageSize: number }) => any;
  updatePageParams: (pageNumber: number) => any;
  loading: boolean;
  error?: string;
  patientPanel?: IPatientPanel;
}

interface IState extends IPageParams {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

class PatientPanelContainer extends React.Component<IProps, IState> {

  title = 'Patient roster';

  constructor(props: IProps) {
    super(props);

    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
    this.formattedPatients = this.formattedPatients.bind(this);
    this.reloadCurrentPage = this.reloadCurrentPage.bind(this);

    const pageParams = getPageParams();
    this.state = {
      pageNumber: pageParams.pageNumber || 0,
      pageSize: pageParams.pageSize || 10,
    };
  }

  async getNextPage() {
    if (this.state.hasNextPage) {
      const pageNumber = this.state.pageNumber + 1;

      this.props.refetchPatientPanel({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.props.updatePageParams(pageNumber);
      this.setState((state: IState) => ({ pageNumber }));
    }
  }

  async getPreviousPage() {
    if (this.state.hasPreviousPage) {
      const pageNumber = this.state.pageNumber - 1;

      await this.props.refetchPatientPanel({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.props.updatePageParams(pageNumber);
      this.setState((state: IState) => ({ pageNumber }));
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

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.patientPanel) {
      const { hasNextPage, hasPreviousPage } = nextProps.patientPanel.pageInfo;

      this.setState((state: IState) => ({ hasNextPage, hasPreviousPage }));
    }
  }

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  render() {
    const { error, loading } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <FormattedMessage id='patientPanel.header'>
              {(message: string) => <div className={styles.headerText}>{message}</div>}
            </FormattedMessage>
            <FormattedMessage id='patientPanel.addPatient'>
              {(message: string) =>
                <Link to='/patient-intake' className={styles.button}>{message}</Link>}
            </FormattedMessage>
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
      </div>
    );
  }
}

const getPageParams = (): IPageParams => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: pageParams.pageSize || 10,
  };
};

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    updatePageParams: (pageNumber: number) => {
      const pageParams = getPageParams();
      pageParams.pageNumber = pageNumber;

      dispatch(push({ search: querystring.stringify(pageParams) }));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(patientPanelQuery as any, {
    options: (props: IProps) => ({
      variables: getPageParams(),
    }),
    props: ({ data }) => ({
      refetchPatientPanel: (data ? data.refetch : null),
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      patientPanel: (data ? (data as any).userPatientPanel : null),
    }),
  }),
)(PatientPanelContainer);
