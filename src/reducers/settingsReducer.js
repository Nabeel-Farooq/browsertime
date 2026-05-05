export const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS': {
      const { settingName, settingValue } = action;

      // optional guard (prevents accidental undefined keys)
      if (!settingName) return state;

      return {
        ...state,
        [settingName]: settingValue,
      };
    }

    default:
      return state;
  }
};
