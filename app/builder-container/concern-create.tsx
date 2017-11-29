import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as concernCreateMutationGraphql from '../graphql/queries/concern-create-mutation.graphql';
import { concernCreateMutation, concernCreateMutationVariables } from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as concernStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

interface IOptions {
  variables: concernCreateMutationVariables;
}

interface IProps {
  routeBase: string;
  onClose: () => any;
  redirectToConcern?: (concernId: string) => any;
}

interface IGraphqlProps {
  createConcern?: (options: IOptions) => { data: concernCreateMutation };
}

interface IState {
  loading: boolean;
  error?: string;
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

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        if (this.props.redirectToConcern && concern.data.concernCreate) {
          this.props.redirectToConcern(concern.data.concernCreate.id);
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
              <input
                name="title"
                value={concern.title}
                placeholder={'Enter concern title'}
                className={formStyles.input}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>
                Cancel
              </div>
              <input type="submit" className={styles.submitButton} value="Add concern" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToConcern: (concernId: string) => {
      dispatch(push(`${ownProps.routeBase}/${concernId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(concernCreateMutationGraphql as any, {
    name: 'createConcern',
    options: {
      refetchQueries: ['getConcerns'],
    },
  }),
)(ConcernCreate);
