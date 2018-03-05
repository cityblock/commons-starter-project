import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as concernCreateMutationGraphql from '../graphql/queries/concern-create-mutation.graphql';
import { concernCreateMutation, concernCreateMutationVariables } from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as concernStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: concernCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
  history: History;
}

interface IGraphqlProps {
  createConcern?: (options: IOptions) => { data: concernCreateMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
  concern: concernCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

export class ConcernCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      error: null,
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

    this.setState({ [fieldName as any]: fieldValue });

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit() {
    const { history, routeBase } = this.props;
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
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  render() {
    const { loading, concern } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={concernStyles.container}>
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
        </form>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(concernCreateMutationGraphql as any, {
    name: 'createConcern',
    options: {
      refetchQueries: ['getConcerns'],
    },
  }),
)(ConcernCreate);
