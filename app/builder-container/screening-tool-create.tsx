import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import screeningToolCreateMutationGraphql from '../graphql/queries/screening-tool-create-mutation.graphql';
import {
  screeningToolCreateMutation,
  screeningToolCreateMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import loadingStyles from '../shared/css/loading-spinner.css';
import screeningToolStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import styles from './css/risk-area-create.css';

interface IOptions {
  variables: screeningToolCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  riskAreas?: FullRiskAreaFragment[];
  onClose: () => any;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  createScreeningTool?: (options: IOptions) => { data: screeningToolCreateMutation };
}

interface IState {
  loading: boolean;
  screeningTool: screeningToolCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps & IRouterProps;

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

    this.setState({ [fieldName as any]: fieldValue } as any);

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit() {
    const { history, routeBase, openErrorPopup } = this.props;
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
        if (screeningTool.data.screeningToolCreate) {
          history.push(`${routeBase}/${screeningTool.data.screeningToolCreate.id}`);
        }
      } catch (err) {
        this.setState({ loading: false });
        openErrorPopup(err.message);
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
            <TextInput
              name="title"
              value={screeningTool.title}
              placeholderMessageId="builder.screeningToolTitle"
              onChange={this.onChange}
            />
            <Select
              required
              name="riskAreaId"
              value={screeningTool.riskAreaId}
              onChange={this.onChange}
            >
              <Option value="" disabled label="Select Assessment" />
              {this.renderRiskAreaOptions()}
            </Select>
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button color="white" onClick={this.props.onClose} messageId="builder.cancel" />
            <Button onClick={this.onSubmit} label="Add screening tool" />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withErrorHandler(),
  graphql(screeningToolCreateMutationGraphql, {
    name: 'createScreeningTool',
    options: {
      refetchQueries: ['getScreeningTools'],
    },
  }),
)(ScreeningToolCreate) as React.ComponentClass<IProps>;
