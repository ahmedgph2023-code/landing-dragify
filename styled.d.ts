import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      cardBackground: string;
      primary: string;
      secondary: string;
      text: {
        primary: string;
        secondary: string;
      };
      accent: {
        blue: string;
        purple: string;
      };
      border: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
  }
}