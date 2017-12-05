import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormLabel from '../../../shared/library/form-label/form-label';
import Search from '../../../shared/library/search/search';
import Spinner from '../../../shared/library/spinner/spinner';
import { ConcernSearch } from '../concern-search';
import ConcernTypeSelect from '../concern-type-select';

describe('Create Concern Modal Concern Select Component', () => {
  const placeholderFn = () => true as any;
  const searchTerm = 'sansaStark';
  const id = 'kingsLanding';
  const concern1 = {
    title: 'Defeat Cersei',
    id,
  };
  const concern2 = {
    title: 'Defeat the Night King',
    id: 'beyondTheWall',
  };
  const concerns = [concern1, concern2] as any;
  const patientCarePlan = {
    concerns: [{
      concernId: id,
    }],
  } as any;

  const wrapper = shallow(
    <ConcernSearch
      concernId=""
      concernType={undefined}
      concerns={concerns}
      onSelectChange={placeholderFn}
      loading={false}
      patientCarePlan={patientCarePlan}
      patientCarePlanLoading={false}
      hideSearchResults={false}
      onSearchTermChange={placeholderFn}
      onSearchTermClick={placeholderFn}
      showAllConcerns={false}
      searchTerm={searchTerm}
      toggleShowAllConcerns={placeholderFn}
      patientId={'patient-id'}
    />,
  );

  it('renders a label to add a concern', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('concernCreate.selectLabel');
  });

  it('renders search box', () => {
    expect(wrapper.find(Search).length).toBe(1);
    expect(wrapper.find(Search).props().value).toBe(searchTerm);
    expect(wrapper.find(Search).props().showAll).toBeFalsy();
    expect(wrapper.find(Search).props().hideResults).toBeFalsy();
    expect(wrapper.find(Search).props().searchOptions).toEqual([concern2]);
    expect(wrapper.find(Search).props().placeholderMessageId).toBe("concernCreate.placeholder");
    expect(wrapper.find(Search).props().emptyPlaceholderMessageId).toBe("concernCreate.noResults");
  });

  it('renders toggle to show all concerns', () => {
    expect(wrapper.find('.showAll').length).toBe(1);
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('concernCreate.showAll');
  });

  it('toggles showing all concerns', () => {
    wrapper.setProps({ showAllConcerns: true });
    expect(wrapper.find(FormattedMessage).props().id).toBe('concernCreate.hideAll');
  });

  it('does not render select to choose concern type initially', () => {
    expect(wrapper.find(ConcernTypeSelect).length).toBe(0);
  });

  it('renders select for concern type after selecting concern', () => {
    wrapper.setProps({ concernId: 'ladyOfWinterfell' });
    expect(wrapper.find(ConcernTypeSelect).length).toBe(1);
  });

  it('renders a spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('div').length).toBe(0);
  });
});
