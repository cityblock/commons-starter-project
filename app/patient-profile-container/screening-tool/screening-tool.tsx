import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as screeningToolQuery from '../../graphql/queries/get-screening-tool.graphql';
import { FullCarePlanSuggestionFragment, FullScreeningToolFragment } from '../../graphql/types';
import CarePlanSuggestions from '../../shared/care-plan-suggestions/care-plan-suggestions';
import ErrorComponent from '../../shared/error-component/error-component';
import Spinner from '../../shared/library/spinner/spinner';
import { Popup } from '../../shared/popup/popup';
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

type allProps = IGraphqlProps & IProps;

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
  };

  render() {
    const { screeningTool, screeningToolLoading, screeningToolError, match } = this.props;
    const { patientId, submissionId } = match.params;
    const { carePlanSuggestions } = this.state;
    const patientRoute = `/patients/${patientId}`;

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
      <React.Fragment>
        <ScreeningToolSubmission
          patientId={patientId}
          screeningTool={screeningTool}
          onSubmissionScored={this.handleSubmissionScored}
        />
        <Popup visible={!!carePlanSuggestions.length} style={'small-padding'}>
          <CarePlanSuggestions
            carePlanSuggestions={carePlanSuggestions || []}
            patientRoute={patientRoute}
            titleMessageId="screeningTool.resultsTitle"
            bodyMessageId="screeningTool.resultsBody"
          />
        </Popup>
      </React.Fragment>
    );
  }
}

export default graphql(screeningToolQuery as any, {
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
})(ScreeningTool);
