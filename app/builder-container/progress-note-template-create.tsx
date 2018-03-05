import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as progressNoteTemplateCreateMutationGraphql from '../graphql/queries/progress-note-template-create-mutation.graphql';
import {
  progressNoteTemplateCreateMutation,
  progressNoteTemplateCreateMutationVariables,
} from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as progressNoteTemplateStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import TextInput from '../shared/library/text-input/text-input';
import * as styles from './css/risk-area-create.css';

export interface IOptions {
  variables: progressNoteTemplateCreateMutationVariables;
}

interface IProps {
  progressNoteTemplateId: string | null;
  routeBase: string;
  onClose: () => any;
  history: History;
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

  async onSubmit() {
    const { history, routeBase } = this.props;
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
        if (progressNoteTemplate.data.progressNoteTemplateCreate) {
          history.push(`${routeBase}/${progressNoteTemplate.data.progressNoteTemplateCreate.id}`);
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
              value={progressNoteTemplate.title}
              placeholderMessageId="builder.enterProgressNoteTemplateTitle"
              onChange={this.onChange}
            />
          </div>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button color="white" messageId="builder.cancel" onClick={this.props.onClose} />
            <Button onClick={this.onSubmit} label="Add progress note template" />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(progressNoteTemplateCreateMutationGraphql as any, {
    name: 'createProgressNoteTemplate',
    options: {
      refetchQueries: ['getProgressNoteTemplates'],
    },
  }),
)(ProgressNoteTemplateCreate);
