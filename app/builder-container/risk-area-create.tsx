import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as riskAreaGroupsQuery from '../graphql/queries/get-risk-area-groups.graphql';
import * as riskAreaCreateMutationGraphql from '../graphql/queries/risk-area-create-mutation.graphql';
import {
  riskAreaCreateMutation,
  riskAreaCreateMutationVariables,
  AssessmentType,
  FullRiskAreaGroupFragment,
} from '../graphql/types';
import * as riskAreaStyles from '../shared/css/two-panel-right.css';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import Spinner from '../shared/library/spinner/spinner';
import TextInput from '../shared/library/text-input/text-input';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: riskAreaCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
  history: History;
}

interface IGraphqlProps {
  riskAreaGroupsLoading?: boolean;
  error?: string | null;
  riskAreaGroups: FullRiskAreaGroupFragment[];
  createRiskArea?: (options: IOptions) => { data: riskAreaCreateMutation };
}

interface IState {
  title: string;
  assessmentType: AssessmentType | null;
  riskAreaGroupId: string | null;
  order: string;
  mediumRiskThreshold: string;
  highRiskThreshold: string;
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

type Field =
  | 'title'
  | 'assessmentType'
  | 'riskAreaGroupId'
  | 'mediumRiskThreshold'
  | 'highRiskThreshold'
  | 'order';

export class RiskAreaCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      title: '',
      order: '',
      assessmentType: null,
      riskAreaGroupId: null,
      mediumRiskThreshold: '',
      highRiskThreshold: '',
      loading: false,
      error: null,
    };
  }

  onChange = (
    field: Field,
  ): ((e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void) => {
    return (
      e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    ): void => {
      this.setState({ [field as any]: e.currentTarget.value });
    };
  };

  onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      title,
      order,
      mediumRiskThreshold,
      highRiskThreshold,
      riskAreaGroupId,
      assessmentType,
      loading,
    } = this.state;
    const { routeBase, history } = this.props;
    if (
      !loading &&
      this.props.createRiskArea &&
      assessmentType &&
      riskAreaGroupId &&
      mediumRiskThreshold &&
      highRiskThreshold
    ) {
      try {
        this.setState({ loading: true, error: null });
        const riskArea = await this.props.createRiskArea({
          variables: {
            title,
            order: Number(order),
            mediumRiskThreshold: Number(mediumRiskThreshold),
            highRiskThreshold: Number(highRiskThreshold),
            riskAreaGroupId,
            assessmentType,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (riskArea.data.riskAreaCreate) {
          history.push(`${routeBase}/${riskArea.data.riskAreaCreate.id}`);
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
  };

  renderRiskAreaGroupSelect() {
    const { riskAreaGroups } = this.props;
    const riskAreaGroupOptions = riskAreaGroups.map(group => (
      <Option key={group.id} value={group.id} label={group.title} />
    ));

    return (
      <Select value={this.state.riskAreaGroupId || ''} onChange={this.onChange('riskAreaGroupId')}>
        <Option value="" messageId="riskArea.riskAreaGroupId" disabled={true} />
        {riskAreaGroupOptions}
      </Select>
    );
  }

  render() {
    const {
      title,
      order,
      assessmentType,
      mediumRiskThreshold,
      highRiskThreshold,
      loading,
    } = this.state;

    if (loading || this.props.riskAreaGroupsLoading) return <Spinner />;

    return (
      <div className={riskAreaStyles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={styles.inputGroup}>
              <TextInput
                value={title}
                onChange={this.onChange('title')}
                placeholderMessageId="riskArea.title"
              />
              {this.renderRiskAreaGroupSelect()}
              <Select value={assessmentType || ''} onChange={this.onChange('assessmentType')}>
                <Option value="" messageId="riskArea.assessmentType" disabled={true} />
                <Option value="automated" messageId="riskArea.automated" />
                <Option value="manual" messageId="riskArea.manual" />
              </Select>
              <TextInput
                value={order}
                onChange={this.onChange('order')}
                placeholderMessageId="riskArea.order"
              />
              <TextInput
                value={mediumRiskThreshold}
                onChange={this.onChange('mediumRiskThreshold')}
                placeholderMessageId="riskArea.mediumRiskThreshold"
              />
              <TextInput
                value={highRiskThreshold}
                onChange={this.onChange('highRiskThreshold')}
                placeholderMessageId="riskArea.highRiskThreshold"
              />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add assessment" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(riskAreaGroupsQuery as any, {
    props: ({ data }) => ({
      riskAreaGroupsLoading: data ? data.loading : false,
      error: data ? data.error : null,
      riskAreaGroups: data ? (data as any).riskAreaGroups : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaCreateMutationGraphql as any, {
    name: 'createRiskArea',
    options: {
      refetchQueries: ['getRiskAreas'],
    },
  }),
)(RiskAreaCreate);
