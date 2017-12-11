import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as progressNoteTemplateCreateMutationGraphql from '../graphql/queries/progress-note-template-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  progressNoteTemplateCreateMutation,
  progressNoteTemplateCreateMutationVariables,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as progressNoteTemplateStyles from '../shared/css/two-panel-right.css';
import * as styles from './css/risk-area-create.css';

export interface IOptions {
  variables: progressNoteTemplateCreateMutationVariables;
}

interface IProps {
  progressNoteTemplateId: string | null;
  routeBase: string;
  onClose: () => any;
  redirectToProgressNoteTemplate?: (progressNoteTemplateId: string) => any;
}

interface IGraphqlProps {
  createProgressNoteTemplate?: (options: IOptions) => { data: progressNoteTemplateCreateMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
  progressNoteTemplate: progressNoteTemplateCreateMutationVariables;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteTemplateCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      loading: false,
      error: null,
      progressNoteTemplate: {
        title: '',
      },
    };
  }

  onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { progressNoteTemplate } = this.state;
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    (progressNoteTemplate as any)[fieldName] = fieldValue;
    this.setState({ progressNoteTemplate });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.createProgressNoteTemplate) {
      try {
        this.setState({ loading: true });
        const progressNoteTemplate = await this.props.createProgressNoteTemplate({
          variables: {
            ...this.state.progressNoteTemplate,
          },
        });
        this.setState({ loading: false });
        this.props.onClose();
        if (
          this.props.redirectToProgressNoteTemplate &&
          progressNoteTemplate.data.progressNoteTemplateCreate
        ) {
          this.props.redirectToProgressNoteTemplate(
            progressNoteTemplate.data.progressNoteTemplateCreate.id,
          );
        }
      } catch (e) {
        this.setState({ error: e.message, loading: false });
      }
    }
    return false;
  }

  render() {
    const { loading, progressNoteTemplate } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    return (
      <div className={progressNoteTemplateStyles.container}>
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
                value={progressNoteTemplate.title}
                placeholder={'Enter progress note template title'}
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
              <input
                type="submit"
                className={styles.submitButton}
                value="Add progress note template"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: allProps): Partial<allProps> {
  return {
    redirectToProgressNoteTemplate: (progressNoteTemplateId: string) => {
      dispatch(push(`${ownProps.routeBase}/${progressNoteTemplateId}`));
    },
  };
}

export default compose(
  connect(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteTemplateCreateMutationGraphql as any, {
    name: 'createProgressNoteTemplate',
    options: {
      refetchQueries: ['getProgressNoteTemplates'],
    },
  }),
)(ProgressNoteTemplateCreate);
