import React from 'react';
import { graphql } from 'react-apollo';
import userSummaryListGraphql from '../graphql/queries/get-user-summary-list.graphql';
import { getUserSummaryList, ShortUser, UserRole } from '../graphql/types';
import { formatCareTeamMemberRole, formatFullName } from '../shared/helpers/format-helpers';
import OptGroup from '../shared/library/optgroup/optgroup';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';

interface IProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
  isLarge: boolean;
  value: string | null;
  isUnselectable?: boolean;
}

interface IGraphqlProps {
  userSummaryList: getUserSummaryList['userSummaryList'];
}

type allProps = IProps & IGraphqlProps;

class CareWorkerSelect extends React.Component<allProps> {
  renderOption(users: ShortUser[]) {
    return users.map(user => {
      return (
        <Option
          key={`option-${user.id}`}
          value={user.id}
          label={formatFullName(user.firstName, user.lastName)}
        />
      );
    });
  }

  renderOptionGroups() {
    const { userSummaryList } = this.props;

    if (!userSummaryList) {
      return;
    }
    const careTeamRoles = Object.keys(UserRole);

    const options = careTeamRoles.reduce((accumulator: any, role) => {
      accumulator[role] = userSummaryList.filter((user: ShortUser) => user.userRole === role);
      return accumulator;
    }, {});

    return Object.keys(options).map(key => {
      const users = options[key];

      // do not show option to assign to a back office admin
      if (users.length > 0 && key !== 'Back_Office_Admin') {
        return (
          <OptGroup label={`${formatCareTeamMemberRole(key as UserRole)}s`} key={`optgroup-${key}`}>
            {this.renderOption(users)}
          </OptGroup>
        );
      }
    });
  }

  render() {
    const { isLarge, value, onChange, isUnselectable } = this.props;

    return (
      <Select required name="careWorkerId" value={value || ''} onChange={onChange} large={isLarge}>
        <Option disabled={!isUnselectable} messageId="careWorkerSelect.placeholder" value="" />
        {this.renderOptionGroups()}
      </Select>
    );
  }
}

export default graphql(userSummaryListGraphql, {
  options: (props: IProps) => ({
    variables: {
      userRoleFilters: Object.keys(UserRole),
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    userSummaryList: data ? (data as any).userSummaryList : null,
  }),
})(CareWorkerSelect);
