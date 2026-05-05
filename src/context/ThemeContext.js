/* eslint-disable react/jsx-filename-extension */
import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { createTheme } from '../lib/theme/index';
import { SettingsContext } from './SettingsContext';

export const ThemeContext = createContext(null);
ThemeContext.displayName = 'ThemeContext';

export const ThemeProvider = ({ children }) => {
  const { settingsState } = useContext(SettingsContext);

  const theme = useMemo(() => {
    return createTheme(settingsState.theme);
  }, [settingsState.theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
