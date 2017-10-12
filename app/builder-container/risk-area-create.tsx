import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as riskAreaCreateMutation from '../graphql/queries/risk-area-create-mutation.graphql';
import {
  riskAreaCreateMutationVariables,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as riskAreaStyles from '../shared/css/two-panel-right.css';
import { IUpdatedField } from '../shared/util/updated-fields';
import * as styles from './css/risk-area-create.css';

interface IOptions { variables: riskAreaCreateMutationVariables; }

interface IProps {
  routeBase: string;
  onClose: () => any;
  redirectToRiskArea?: (riskAreaId: string) => any;
}

interface IGraphqlProps {
  createRiskArea?: (options: IOptions) => { data: { riskAreaCreate: FullRiskAreaFragment } };
}

interface IState {
  loading: boolean;
  error?: string;
  riskArea: riskAreaCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

class RiskAreaCreate extends React.Component<allProps, IState> {

  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      riskArea: {
        title: '',
        order: 1,
      },
    };
  }

  onFieldUpdate(updatedField: IUpdatedField) {
    const { riskArea } = this.state;
    const { fieldName, fieldValue } = updatedField;

    (riskArea as any)[fieldName] = fieldValue;

    this.setState(() => ({ riskArea }));
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState(() => ({ [fieldName]: fieldValue }));

    this.onFieldUpdate({ fieldName, fieldValue });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.createRiskArea) {
      try {
        this.setState({ loading: true });
        const riskArea = await this.props.createRiskArea({
          variables: {
            ...this.state.riskArea,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (this.props.redirectToRiskArea) {
          this.props.redirectToRiskArea(riskArea.data.riskAreaCreate.id);
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  render() {
    const { loading, riskArea } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={riskAreaStyles.container}>
        <form onSubmit={this.onSubmit}>
          <div className={styles.formTop}>
            <div className={styles.close} onClick={this.props.onClose} />
          </div>
          <div className={styles.formCenter}>
            <div className={loadingClass}>
              <div className={styles.loadingContainer}>
                <div className={loadingStyles.loadingSpinner}></div>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                name='title'
                value={riskArea.title}
                placeholder={'Enter domain title'}
                className={formStyles.input}
                onChange={this.onChange} />
              <input
                type='number'
                name='order'
                placeholder={'Enter domain order'}
                value={riskArea.order}
                className={formStyles.input}
                onChange={this.onChange} />
            </div>
          </div>
          <div className={styles.formBottom}>
            <div className={styles.formBottomContent}>
              <div className={styles.cancelButton} onClick={this.props.onClose}>Cancel</div>
              <input
                type='submit'
                className={styles.submitButton}
                value='Add domain' />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToRiskArea: (riskAreaId: string) => {
      dispatch(push(`${ownProps.routeBase}/${riskAreaId}`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps>(riskAreaCreateMutation as any, {
    name: 'createRiskArea',
    options: {
      refetchQueries: [
        'getRiskAreas',
      ],
    },
  }),
)(RiskAreaCreate);
