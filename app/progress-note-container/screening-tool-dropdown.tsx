import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
import { getScreeningToolsQuery } from '../graphql/types';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  screeningTools?: getScreeningToolsQuery['screeningTools'];
}

interface IDispatchProps {
  redirectToScreeningTool: (screeningToolId: string) => any;
}

type allProps = IProps & IGraphqlProps & IDispatchProps;

class ScreeningToolDropdown extends React.Component<allProps> {
  onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    this.props.redirectToScreeningTool(value);
  };

  render() {
    const { screeningTools } = this.props;
    const sortOptions = (screeningTools || []).map(
      tool =>
        tool ? (
          <option key={tool.id} value={tool.id}>
            {tool.title}
          </option>
        ) : null,
    );
    return (
      <Select value={''} onChange={this.onSortChange}>
        <Option disabled={true} messageId="progressNote.administerTool" value="" />
        {sortOptions}
      </Select>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToScreeningTool: (screeningToolId: string) => {
      dispatch(push(`/patients/${ownProps.patientId}/tools/${screeningToolId}`));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, allProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(ScreeningToolDropdown);
