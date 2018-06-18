import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import concernCreateMutationGraphql from '../graphql/queries/concern-create-mutation.graphql';
import { concernCreateMutation, concernCreateMutationVariables } from '../graphql/types';
import loadingStyles from '../shared/css/loading-spinner.css';
import concernStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import styles from './css/risk-area-create.css';

interface IOptions {
  variables: concernCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  createConcern?: (options: IOptions) => { data: concernCreateMutation };
}

interface IState {
  loading: boolean;
  concern: concernCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps & IRouterProps;

export class ConcernCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      concern: { title: '' },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { concern } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (concern as any)[fieldName] = fieldValue;

    this.setState({ concern });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({ [fieldName as any]: fieldValue } as any);

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit() {
    const { history, routeBase, openErrorPopup } = this.props;
    if (this.props.createConcern) {
      try {
        this.setState({ loading: true });
        const concern = await this.props.createConcern({
          variables: {
            ...this.state.concern,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (concern.data.concernCreate) {
          history.push(`${routeBase}/${concern.data.concernCreate.id}`);
        }
      } catch (err) {
        this.setState({ loading: false });
        openErrorPopup(err.message);
      }
    }
    return false;
  }

  render() {
    const { loading, concern } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={concernStyles.container}>
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
              value={concern.title}
              placeholderMessageId="builder.enterConcernTitle"
              onChange={this.onChange}
            />
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button color="white" messageId="builder.cancel" onClick={this.props.onClose} />
            <Button onClick={this.onSubmit} label="Add concern" />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withErrorHandler(),
  graphql(concernCreateMutationGraphql, {
    name: 'createConcern',
    options: {
      refetchQueries: ['getConcerns'],
    },
  }),
)(ConcernCreate) as React.ComponentClass<IProps>;
