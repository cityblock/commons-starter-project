import { Font } from '@react-pdf/core';

export const registerFonts = (): void => {
  Font.register(`${__dirname}/fonts/Roboto/Roboto-Regular.ttf`, {
    family: 'Roboto',
  });
  Font.register(`${__dirname}/fonts/Roboto/Roboto-Medium.ttf`, {
    family: 'Roboto Bold',
  });
  Font.register(`${__dirname}/fonts/Basetica/Basetica-Medium.ttf`, {
    family: 'Basetica',
  });
  Font.register(`${__dirname}/fonts/Basetica/Basetica-Black.ttf`, {
    family: 'Basetica Bold',
  });
};

export const clearFonts = (): void => {
  Font.clear();
};
