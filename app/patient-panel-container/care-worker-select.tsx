import * as React from 'react';
import { graphql } from 'react-apollo';
import * as userSummaryListQuery from '../graphql/queries/get-user-summary-list.graphql';
import { getUserSummaryListQuery, ShortUserFragment } from '../graphql/types';
import { formatFullName } from '../shared/helpers/format-helpers';
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
  userSummaryList: getUserSummaryListQuery['userSummaryList'];
}

type allProps = IProps & IGraphqlProps;

const CARE_WORKER_ROLES = [
  'physician',
  'nurseCareManager',
  'healthCoach',
  'communityHealthPartner',
];

class CareWorkerSelect extends React.Component<allProps> {
  renderOption(users: ShortUserFragment[]) {
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

    const options = CARE_WORKER_ROLES.reduce((accumulator: any, role) => {
      accumulator[role] = userSummaryList.filter(
        (user: ShortUserFragment) => user.userRole === role,
      );
      return accumulator;
    }, {});

    return Object.keys(options).map(key => {
      const users = options[key];

      if (users.length > 0) {
        return (
          <OptGroup messageId={`careWorker.${key}`} key={`optgroup-${key}`}>
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

export default graphql(userSummaryListQuery as any, {
  options: (props: IProps) => ({
    variables: {
      userRoleFilters: CARE_WORKER_ROLES,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    userSummaryList: data ? (data as any).userSummaryList : null,
  }),
})(CareWorkerSelect);
