import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as screeningToolCreateMutationGraphql from '../graphql/queries/screening-tool-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  screeningToolCreateMutation,
  screeningToolCreateMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as screeningToolStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: screeningToolCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  riskAreas?: FullRiskAreaFragment[];
  onClose: () => any;
  redirectToScreeningTool?: (screeningToolId: string) => any;
}

interface IGraphqlProps {
  createScreeningTool?: (options: IOptions) => { data: screeningToolCreateMutation };
}

interface IState {
  loading: boolean;
  error?: string;
  screeningTool: screeningToolCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

class ScreeningToolCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderRiskAreaOptions = this.renderRiskAreaOptions.bind(this);

    this.state = {
      loading: false,
      screeningTool: {
        title: '',
        riskAreaId: '',
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { screeningTool } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (screeningTool as any)[fieldName] = fieldValue;

    this.setState({ screeningTool });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({ [fieldName as any]: fieldValue });

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.createScreeningTool) {
      try {
        this.setState({ loading: true });
        const screeningTool = await this.props.createScreeningTool({
          variables: {
            ...this.state.screeningTool,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (this.props.redirectToScreeningTool && screeningTool.data.screeningToolCreate) {
          this.props.redirectToScreeningTool(screeningTool.data.screeningToolCreate.id);
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  renderRiskAreaOptions() {
    const { riskAreas } = this.props;

    if (riskAreas) {
      return riskAreas.map(riskArea => (
        <option key={riskArea.id} value={riskArea.id}>
          {riskArea.title}
        </option>
      ));
    }
  }

  render() {
    const { loading, screeningTool } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={screeningToolStyles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name="title"
                value={screeningTool.title}
                placeholder={'Enter screening tool title'}
                className={formStyles.input}
                onChange={this.onChange}
              />
              <select
                required
                name="riskAreaId"
                value={screeningTool.riskAreaId}
                onChange={this.onChange}
                className={formStyles.select}
              >
                <option value="" disabled hidden>
                  Select Domain
                </option>
                {this.renderRiskAreaOptions()}
              </select>
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add screening tool" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToScreeningTool: (screeningToolId: string) => {
      dispatch(push(`${ownProps.routeBase}/${screeningToolId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolCreateMutationGraphql as any, {
    name: 'createScreeningTool',
    options: {
      refetchQueries: ['getScreeningTools'],
    },
  }),
)(ScreeningToolCreate);
