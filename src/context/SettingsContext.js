/* eslint-disable react/jsx-filename-extension */
import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { settingsReducer } from '../reducers/settingsReducer';
import { THEMES } from '../lib/constants/index';

export const SettingsContext = createContext(null);
SettingsContext.displayName = 'SettingsContext';

const DEFAULT_SETTINGS = {
  theme: THEMES.DARK,
  showResultsCount: true,
};

const init = () => {
  try {
    const localData = localStorage.getItem('settings');
    return localData ? JSON.parse(localData) : DEFAULT_SETTINGS;
  } catch (e) {
    // fallback if JSON is corrupted or access fails
    return DEFAULT_SETTINGS;
  }
};

export const SettingsProvider = ({ children }) => {
  const [settingsState, dispatch] = useReducer(
    settingsReducer,
    DEFAULT_SETTINGS,
    init
  );

  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settingsState));
    } catch (e) {
      // ignore write errors (e.g. quota exceeded)
    }
  }, [settingsState]);

  const updateSettings = useCallback((settingName, settingValue) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settingName,
      settingValue,
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settingsState,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
