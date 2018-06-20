import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import progressNoteTemplateGraphql from '../graphql/queries/get-progress-note-template.graphql';
import progressNoteTemplateEditGraphql from '../graphql/queries/progress-note-template-edit-mutation.graphql';
import {
  progressNoteTemplateEdit,
  progressNoteTemplateEditVariables,
  FullProgressNoteTemplate,
} from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';

interface IProps {
  routeBase: string;
  match?: {
    params: {
      progressNoteTemplateId: string | null;
    };
  };
}

interface IGraphqlProps {
  progressNoteTemplate: FullProgressNoteTemplate | null;
  progressNoteTemplateLoading?: boolean;
  progressNoteTemplateError?: string | null;
  refetchProgressNoteTemplate: () => any;
  editProgressNoteTemplate: (
    options: { variables: progressNoteTemplateEditVariables },
  ) => { data: progressNoteTemplateEdit };
  onDelete: (progressNoteTemplateId: string) => any;
}

interface IState {
  deleteConfirmationInProgress: boolean;
  deleteError: string | null;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError: string | null;
}

type allProps = IProps & IGraphqlProps;

export class ProgressNoteTemplate extends React.Component<allProps, IState> {
  editTitleInput: HTMLInputElement | null = null;
  titleBody: HTMLDivElement | null = null;
  state = {
    deleteConfirmationInProgress: false,
    deleteError: null,
    editedTitle: '',
    editingTitle: false,
    editTitleError: null,
  };

  constructor(props: allProps) {
    super(props);

    this.reloadProgressNoteTemplate = this.reloadProgressNoteTemplate.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.focusInput = this.focusInput.bind(this);
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { progressNoteTemplate } = nextProps;

    if (progressNoteTemplate) {
      if (!this.props.progressNoteTemplate) {
        this.setState({
          editedTitle: progressNoteTemplate.title,
        });
      } else if (this.props.progressNoteTemplate.id !== progressNoteTemplate.id) {
        this.setState({
          editedTitle: progressNoteTemplate.title,
        });
      }
    }
  }

  reloadProgressNoteTemplate() {
    const { refetchProgressNoteTemplate } = this.props;

    if (refetchProgressNoteTemplate) {
      refetchProgressNoteTemplate();
    }
  }

  onClickDelete() {
    const progressNoteTemplateId = getProgressNoteTemplateId(this.props);
    if (progressNoteTemplateId) {
      this.setState({ deleteConfirmationInProgress: true });
    }
  }

  async onConfirmDelete() {
    const { onDelete } = this.props;
    const progressNoteTemplateId = getProgressNoteTemplateId(this.props);
    if (progressNoteTemplateId) {
      try {
        this.setState({ deleteError: null });
        await onDelete(progressNoteTemplateId);
        this.setState({ deleteConfirmationInProgress: false });
      } catch (err) {
        this.setState({ deleteError: err.message });
      }
    }
  }

  onCancelDelete() {
    this.setState({ deleteError: null, deleteConfirmationInProgress: false });
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState({ [name as any]: value || '' } as any);
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { editProgressNoteTemplate } = this.props;
    const { editedTitle } = this.state;
    const progressNoteTemplateId = getProgressNoteTemplateId(this.props);
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && progressNoteTemplateId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState({ editTitleError: null });
          await editProgressNoteTemplate({
            variables: { progressNoteTemplateId, title: editedTitle },
          });
          this.setState({ editTitleError: null, editingTitle: false });
        } catch (err) {
          this.setState({ editTitleError: err.message });
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState({ editingTitle: false });
    }
  }

  onClickToEditTitle() {
    this.setState({ editingTitle: true });
    setTimeout(() => (this.focusInput(this.editTitleInput), 100));
  }

  focusInput(input: HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  render() {
    const { progressNoteTemplate, routeBase } = this.props;
    const {
      deleteConfirmationInProgress,
      deleteError,
      editedTitle,
      editingTitle,
      editTitleError,
    } = this.state;

    const outerContainerStyles = classNames(styles.container, {
      [styles.deleteConfirmationContainer]: deleteConfirmationInProgress,
    });
    const progressNoteTemplateContainerStyles = classNames(styles.itemContainer, {
      [styles.hidden]: deleteConfirmationInProgress,
    });
    const deleteConfirmationStyles = classNames(styles.deleteConfirmation, {
      [styles.hidden]: !deleteConfirmationInProgress,
    });
    const deleteErrorStyles = classNames(styles.deleteError, {
      [styles.hidden]: !deleteConfirmationInProgress || !deleteError,
    });
    const titleTextStyles = classNames(styles.largeText, styles.title, {
      [styles.hidden]: editingTitle,
    });
    const titleEditStyles = classNames(styles.largeTextEditor, {
      [styles.hidden]: !editingTitle,
      [styles.error]: !!editTitleError,
    });
    const closeRoute = routeBase || '/builder/progress-note-templates';
    if (progressNoteTemplate) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon} />
            <div className={styles.deleteConfirmationText}>
              Are you sure you want to delete this progress note template?
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <Button color="white" onClick={this.onCancelDelete} messageId="builder.cancel" />
              <Button messageId="computedField.confirmDelete" onClick={this.onConfirmDelete} />
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting progress note template.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={progressNoteTemplateContainerStyles}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.controls}>
                  <Link to={closeRoute} className={styles.close}>
                    Close
                  </Link>
                  <div className={styles.menuItem} onClick={this.onClickDelete}>
                    <div className={styles.trashIcon} />
                    <div className={styles.menuLabel}>Delete progress note template</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.itemBody}>
              <div className={styles.smallText}>Title:</div>
              <div
                ref={div => {
                  this.titleBody = div;
                }}
                className={titleTextStyles}
                onClick={this.onClickToEditTitle}
              >
                {progressNoteTemplate.title}
              </div>
              <div className={titleEditStyles}>
                <input
                  name="editedTitle"
                  ref={area => {
                    this.editTitleInput = area;
                  }}
                  value={editedTitle}
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                />
              </div>
              <Link to={`/builder/progress-note-templates/${progressNoteTemplate.id}/questions`}>
                Add questions to progress note template
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      const { progressNoteTemplateLoading, progressNoteTemplateError } = this.props;
      if (progressNoteTemplateLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!progressNoteTemplateError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon} />
              <div className={styles.loadingErrorLabel}>Unable to load progress note template</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <Button onClick={this.reloadProgressNoteTemplate} label="Try again" />
            </div>
          </div>
        );
      } else {
        return <div className={styles.container} />;
      }
    }
  }
}

function getProgressNoteTemplateId(ownProps: IProps): string | null {
  return ownProps.match ? ownProps.match.params.progressNoteTemplateId : null;
}

export default compose(
  graphql(progressNoteTemplateEditGraphql, {
    name: 'editProgressNoteTemplate',
  }),
  graphql(progressNoteTemplateGraphql, {
    skip: (props: IProps) => !getProgressNoteTemplateId(props),
    options: (props: IProps) => ({
      variables: { progressNoteTemplateId: getProgressNoteTemplateId(props) },
    }),
    props: ({ data }) => ({
      progressNoteTemplateLoading: data ? data.loading : false,
      progressNoteTemplateError: data ? data.error : null,
      progressNoteTemplate: data ? (data as any).progressNoteTemplate : null,
      refetchProgressNoteTemplate: data ? data.refetch : null,
    }),
  }),
)(ProgressNoteTemplate) as React.ComponentClass<IProps>;
