import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import * as screeningToolQuery from '../../graphql/queries/get-screening-tool.graphql';
import { FullCarePlanSuggestionFragment, FullScreeningToolFragment } from '../../graphql/types';
import ErrorComponent from '../../shared/error-component/error-component';
import Spinner from '../../shared/library/spinner/spinner';
import ScreeningToolHistoricalSubmission from './screening-tool-historical-submission';
import ScreeningToolSubmission from './screening-tool-submission';

interface IProps {
  match: {
    params: {
      patientId: string;
      screeningToolId: string;
      submissionId?: string;
    };
  };
}

interface IGraphqlProps {
  screeningTool?: FullScreeningToolFragment;
  screeningToolLoading?: boolean;
  screeningToolError: ApolloError | undefined | null;
}

interface IDispatchProps {
  openSuggestionsPopup: (carePlanSuggestions: FullCarePlanSuggestionFragment[]) => void;
}

type allProps = IGraphqlProps & IProps & IDispatchProps;

interface IState {
  carePlanSuggestions: FullCarePlanSuggestionFragment[];
}

export class ScreeningTool extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = { carePlanSuggestions: [] };
  }

  componentWillUnmount() {
    this.setState({ carePlanSuggestions: [] });
  }

  handleSubmissionScored = (suggestions: FullCarePlanSuggestionFragment[]) => {
    this.setState({ carePlanSuggestions: suggestions });

    if (suggestions.length > 0) {
      this.props.openSuggestionsPopup(suggestions);
    }
  };

  render() {
    const { screeningTool, screeningToolLoading, screeningToolError, match } = this.props;
    const { patientId, submissionId } = match.params;

    if (screeningToolLoading !== false) {
      return <Spinner />;
    }

    if (screeningToolError) {
      return <ErrorComponent error={screeningToolError} />;
    }

    if (!screeningTool) {
      return (
        <ErrorComponent errorMessage="There was an error loading the screening tool. Try again." />
      );
    }

    return submissionId ? (
      <ScreeningToolHistoricalSubmission
        patientId={patientId}
        submissionId={submissionId}
        screeningTool={screeningTool}
      />
    ) : (
      <ScreeningToolSubmission
        patientId={patientId}
        screeningTool={screeningTool}
        onSubmissionScored={this.handleSubmissionScored}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => ({
  openSuggestionsPopup: (carePlanSuggestions: FullCarePlanSuggestionFragment[]) =>
    dispatch(
      openPopup({
        name: 'CARE_PLAN_SUGGESTIONS',
        options: {
          patientId: ownProps.match.params.patientId,
          carePlanSuggestions,
        },
      }),
    ),
});

export default compose(
  connect<{}, IDispatchProps, IProps & IDispatchProps>(null, mapDispatchToProps),
  graphql(screeningToolQuery as any, {
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.match.params.screeningToolId,
      },
    }),
    props: ({ data }): IGraphqlProps => ({
      screeningToolLoading: data ? data.loading : false,
      screeningToolError: data ? data.error : null,
      screeningTool: data ? (data as any).screeningTool : null,
    }),
  }),
)(ScreeningTool);
