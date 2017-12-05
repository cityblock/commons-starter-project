import { formatSearchText } from '../helpers';

describe('Library Search Helpers', () => {
  const fullText = 'Nymeria the Direwolf!';

  it('returns full text if no match to highlight', () => {
    const searchTerm = 'Lady';
    expect(formatSearchText(fullText, searchTerm)).toBe(fullText);
  });

  it('returns span around highlighted text if match found', () => {
    const searchTerm = 'Direwolf';
    const result = formatSearchText(fullText, searchTerm);
    expect(result.length).toBe(fullText.length);

    expect(result[0]).toBe('N');
    expect(result[20]).toBe('!');
    expect(result[12]).toMatchObject({
      type: 'span',
      props: { children: 'D' },
    });
    expect(result[19]).toMatchObject({
      type: 'span',
      props: { children: 'f' },
    });
  });
});
