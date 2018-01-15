import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
import { getScreeningToolsQuery } from '../graphql/types';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IProps {
  patientId: string;
  history: History;
}

interface IGraphqlProps {
  screeningTools?: getScreeningToolsQuery['screeningTools'];
}

type allProps = IProps & IGraphqlProps;

class ScreeningToolDropdown extends React.Component<allProps> {
  onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { history, patientId } = this.props;
    const value = event.target.value;

    history.push(`/patients/${patientId}/tools/${value}`);
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

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(ScreeningToolDropdown);
