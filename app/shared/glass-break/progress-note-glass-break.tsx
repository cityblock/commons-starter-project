import { omit } from 'lodash';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import progressNoteGlassBreakCheckQuery from '../../graphql/queries/get-progress-note-glass-break-check.graphql';
import progressNoteGlassBreaksForUserQuery from '../../graphql/queries/get-progress-note-glass-breaks-for-user.graphql';
import createProgressNoteGlassBreakMutationGraphql from '../../graphql/queries/progress-note-glass-break-create-mutation.graphql';
import {
  getProgressNoteGlassBreaksForUserQuery,
  getProgressNoteGlassBreakCheckQuery,
  progressNoteGlassBreakCreateMutation,
  progressNoteGlassBreakCreateMutationVariables,
} from '../../graphql/types';
import withCurrentUser, {
  IInjectedProps as ICurrentUserProps,
} from '../with-current-user/with-current-user';
import GlassBreak from './glass-break';

export interface IInjectedProps {
  glassBreakId: string | null;
}

interface IExternalProps {
  progressNoteId: string;
}

interface IGraphqlProps {
  loadingGlassBreakCheck: boolean;
  errorGlassBreakCheck: string | null;
  glassBreakCheck: getProgressNoteGlassBreakCheckQuery['progressNoteGlassBreakCheck'];
  loadingGlassBreaks: boolean;
  errorGlassBreaks: string | null;
  glassBreaks: getProgressNoteGlassBreaksForUserQuery['progressNoteGlassBreaksForUser'];
  createProgressNoteGlassBreak: (
    options: { variables: progressNoteGlassBreakCreateMutationVariables },
  ) => { data: progressNoteGlassBreakCreateMutation };
}

const progressNoteGlassBreak = () => <P extends {}>(
  Component:
    | React.ComponentClass<P & IInjectedProps>
    | React.StatelessComponent<P & IInjectedProps>,
) => {
  type IProps = P & IExternalProps & IInjectedProps & ICurrentUserProps;
  type resultProps = IProps & IGraphqlProps;

  class ProgressNoteGlassBreak extends React.Component<resultProps> {
    isLoading(): boolean {
      const { loadingGlassBreakCheck, errorGlassBreakCheck } = this.props;
      return !!loadingGlassBreakCheck || !!errorGlassBreakCheck;
    }

    getWrappedComponentProps() {
      return omit(this.props, [
        'loadingGlassBreakCheck',
        'errorGlassBreakCheck',
        'glassBreakCheck',
        'featureFlags',
        'currentUser',
        'glassBreaks',
        'loadingGlassBreaks',
        'errorGlassBreaks',
        'createProgressNoteGlassBreaks',
      ]);
    }

    getGlassBreakId(): string | null {
      const { glassBreaks, progressNoteId } = this.props;

      const foundGlassBreak = (glassBreaks || []).find(
        glassBreak => glassBreak.progressNoteId === progressNoteId,
      );

      return foundGlassBreak ? foundGlassBreak.id : null;
    }

    createGlassBreak = async (reason: string, note: string | null) => {
      const { createProgressNoteGlassBreak, progressNoteId } = this.props;
      return createProgressNoteGlassBreak({ variables: { progressNoteId, reason, note } });
    };

    render(): JSX.Element | null {
      if (this.isLoading()) return null;

      const { featureFlags, glassBreakCheck } = this.props;
      const glassBreakId = this.getGlassBreakId();
      // render componetn if can auto break glass, don't need to break glass, or already broke glass
      if (featureFlags.canAutoBreakGlass || glassBreakCheck.isGlassBreakNotNeeded || glassBreakId) {
        return <Component {...this.getWrappedComponentProps()} glassBreakId={glassBreakId} />;
      }
      // otherwise render glass break screen
      return <GlassBreak resource="progressNote" createGlassBreak={this.createGlassBreak} />;
    }
  }

  return compose(
    withCurrentUser(),
    graphql(progressNoteGlassBreakCheckQuery, {
      options: (props: IProps) => ({
        variables: {
          progressNoteId: props.progressNoteId,
        },
      }),
      props: ({ data }) => ({
        loadingGlassBreakCheck: data ? data.loading : false,
        errorGlassBreakCheck: data ? data.error : null,
        glassBreakCheck: data ? (data as any).progressNoteGlassBreakCheck : null,
      }),
    }),
    graphql(progressNoteGlassBreaksForUserQuery, {
      options: () => ({
        // Lazy load to ensure cache always has updated session glass breaks
      }),
      props: ({ data }) => ({
        loadingGlassBreaks: data ? data.loading : false,
        errorGlassBreaks: data ? data.error : null,
        glassBreaks: data ? (data as any).progressNoteGlassBreaksForUser : null,
      }),
    }),
    graphql<IGraphqlProps, IProps, resultProps>(createProgressNoteGlassBreakMutationGraphql, {
      name: 'createProgressNoteGlassBreak',
      options: {
        refetchQueries: ['getProgressNoteGlassBreaksForUser'],
      },
    }),
  )(ProgressNoteGlassBreak);
};

export default progressNoteGlassBreak;
