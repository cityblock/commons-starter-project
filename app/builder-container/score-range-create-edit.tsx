import * as classNames from 'classnames';
import { clone, isNil, omit, omitBy } from 'lodash-es';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as scoreRangeCreateMutationGraphql from '../graphql/queries/screening-tool-score-range-create-mutation.graphql';
import * as scoreRangeDeleteMutationGraphql from '../graphql/queries/screening-tool-score-range-delete-mutation.graphql';
import * as scoreRangeEditMutationGraphql from '../graphql/queries/screening-tool-score-range-edit-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  screeningToolScoreRangeCreateMutation,
  screeningToolScoreRangeCreateMutationVariables,
  screeningToolScoreRangeDeleteMutation,
  screeningToolScoreRangeDeleteMutationVariables,
  screeningToolScoreRangeEditMutation,
  screeningToolScoreRangeEditMutationVariables,
  FullScreeningToolScoreRangeFragment,
  RiskAdjustmentTypeOptions,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as scoreRangeStyles from '../shared/css/two-panel-right.css';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import { IUpdatedField } from '../shared/util/updated-fields';
import CarePlanSuggestions from './care-plan-suggestions';
import * as styles from './css/risk-area-create.css';

interface ICreateOptions {
  variables: screeningToolScoreRangeCreateMutationVariables;
}
interface IEditOptions {
  variables: screeningToolScoreRangeEditMutationVariables;
}
interface IDeleteOptions {
  variables: screeningToolScoreRangeDeleteMutationVariables;
}

interface IProps {
  scoreRange?: FullScreeningToolScoreRangeFragment | null;
  screeningToolId: string;
  mutate?: any;
}

interface IGraphqlProps {
  createScoreRange?: (options: ICreateOptions) => { data: screeningToolScoreRangeCreateMutation };
  editScoreRange?: (options: IEditOptions) => { data: screeningToolScoreRangeEditMutation };
  deleteScoreRange?: (options: IDeleteOptions) => { data: screeningToolScoreRangeDeleteMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
  scoreRange: screeningToolScoreRangeCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

export class ScoreRangeCreateEdit extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);

    this.state = {
      loading: false,
      error: null,
      scoreRange: props.scoreRange
        ? props.scoreRange
        : {
            description: 'edit me!',
            minimumScore: 0,
            maximumScore: 1,
            screeningToolId: props.screeningToolId,
            riskAdjustmentType: 'inactive' as RiskAdjustmentTypeOptions,
          },
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { screeningToolId } = nextProps;

    if (screeningToolId !== this.props.screeningToolId) {
      const { scoreRange } = this.state;
      scoreRange.screeningToolId = screeningToolId;
      this.setState({ scoreRange });
    }
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const scoreRange = clone(this.state.scoreRange);
    const { fieldName, fieldValue } = updatedField;

    (scoreRange as any)[fieldName] = fieldValue;

    this.setState({ scoreRange });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    const fieldValue: any = event.target.value;

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const filtered = omitBy<screeningToolScoreRangeCreateMutationVariables>(
        this.state.scoreRange,
        isNil,
      );

      if (this.props.scoreRange && this.props.editScoreRange) {
        await this.props.editScoreRange({
          variables: {
            screeningToolScoreRangeId: this.props.scoreRange.id,
            ...omit(filtered, ['screeningToolId']),
          },
        });
      } else if (this.props.createScoreRange) {
        await this.props.createScoreRange({
          variables: filtered as any,
        });
      }
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  async onDeleteClick() {
    if (this.props.scoreRange && this.props.deleteScoreRange) {
      await this.props.deleteScoreRange({
        variables: {
          screeningToolScoreRangeId: this.props.scoreRange.id,
        },
      });
    }
  }

  render() {
    const { loading, scoreRange } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const createEditText = this.props.scoreRange ? 'Save' : 'Add score range';
    const deleteHtml = this.props.scoreRange ? (
      <div onClick={this.onDeleteClick}>delete</div>
    ) : null;
    const scoreRangeId = this.props.scoreRange ? (
      <div className={scoreRangeStyles.smallText}>Score Range ID: {this.props.scoreRange.id}</div>
    ) : (
      <div className={scoreRangeStyles.smallText}>New Score Range!</div>
    );
    const carePlanSuggestionsHtml = this.props.scoreRange ? (
      <CarePlanSuggestions scoreRange={this.props.scoreRange} />
    ) : null;
    return (
      <form onSubmit={this.onSubmit} className={scoreRangeStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          {scoreRangeId}
          <br />
          <div className={styles.inlineInputGroup}>
            <div className={scoreRangeStyles.smallText}>Description:</div>
            <input
              name="description"
              value={scoreRange.description}
              placeholder={'Enter score range description'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={scoreRangeStyles.smallText}>Minimum Score:</div>
            <input
              name="minimumScore"
              value={scoreRange.minimumScore}
              placeholder={'Enter minimum score'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={scoreRangeStyles.smallText}>Maximum Score:</div>
            <input
              name="maximumScore"
              value={scoreRange.maximumScore}
              placeholder={'Enter maximum score'}
              className={classNames(formStyles.input, formStyles.inputSmall)}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.inlineInputGroup}>
            <div className={scoreRangeStyles.smallText}>Risk adjustment type:</div>
            <Select
              required
              name="riskAdjustmentType"
              value={scoreRange.riskAdjustmentType}
              onChange={this.onChange}
              className={classNames(formStyles.select, formStyles.inputSmall)}
            >
              <Option value="inactive" messageId="riskAdjustmentType.inactive" />
              <Option value="increment" messageId="riskAdjustmentType.increment" />
              <Option value="forceHighRisk" messageId="riskAdjustmentType.forceHighRisk" />
            </Select>
          </div>
        </div>
        {carePlanSuggestionsHtml}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input type="submit" className={styles.submitButton} value={createEditText} />
            {deleteHtml}
          </div>
        </div>
      </form>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(scoreRangeCreateMutationGraphql as any, {
    name: 'createScoreRange',
    options: {
      refetchQueries: ['getScreeningTools'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(scoreRangeEditMutationGraphql as any, {
    name: 'editScoreRange',
  }),
  graphql<IGraphqlProps, IProps, allProps>(scoreRangeDeleteMutationGraphql as any, {
    name: 'deleteScoreRange',
    options: {
      refetchQueries: ['getScreeningTools'],
    },
  }),
)(ScoreRangeCreateEdit);
