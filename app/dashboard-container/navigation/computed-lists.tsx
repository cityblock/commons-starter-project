import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { FullPatientListFragment } from '../../graphql/types';
import NavigationItem from './navigation-item';

interface IProps {
  patientLists: FullPatientListFragment[];
  loading: boolean;
  error: ApolloError | null | undefined;
  routeBase: string;
  answerId: string | null;
}

const ComputedLists: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientLists, loading, error, routeBase, answerId } = props;

  if (loading || error) {
    return (
      <NavigationItem
        selected="loading"
        isSelected={false}
        routeBase={routeBase}
        icon="rotateRight"
        noDivider={true}
      />
    );
  }

  const renderedLists = patientLists.map((list, i) => {
    // do not show divider if this is the last computed list or if the
    // computed list directly following this one is selected
    const noDivider =
      i === patientLists.length - 1 ||
      (!!answerId && i < patientLists.length - 1 && answerId === patientLists[i + 1].answerId);

    return (
      <NavigationItem
        key={list.id}
        text={list.title}
        routeBase={routeBase}
        answerId={list.answerId}
        selected="computed"
        isSelected={!!answerId && answerId === list.answerId}
        icon="labelOutline"
        noDivider={noDivider}
      />
    );
  });

  return <div>{renderedLists}</div>;
};

export default ComputedLists;
