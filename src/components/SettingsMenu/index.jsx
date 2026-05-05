import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  Popover,
  Typography,
  IconButton,
  Divider,
  Paper,
  InputBase,
  Select,
  MenuItem,
  ListItemText,
  Switch,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
} from '@material-ui/core';
import { THEMES } from '../../lib/constants';
import { SettingsContext } from '../../context/SettingsContext';

const CustomInput = withStyles((theme) => ({
  input: {
    width: 210,
    padding: '5px 10px',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    fontSize: 16,
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  content: {
    width: 350,
    margin: '8px 16px',
  },
  settings: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(2),
  },
  formLabel: {
    marginBottom: theme.spacing(2),
  },
  root: {
    marginBottom: 10, // ✅ fixed typo
    padding: '2px 8px',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    '&:hover': {
      background: 'none',
    },
  },
  themeSampleMain: {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.background.default,
  },
  themeSamplePrimary: {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.primary.main,
  },
  divider: {
    height: 28,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

const SettingsMenu = ({ open, handleClose, anchorEl }) => {
  const { settingsState, updateSettings } = useContext(SettingsContext);
  const { theme, showResultsCount } = settingsState;
  const classes = useStyles();

  const handleThemeChange = useCallback((e) => {
    updateSettings('theme', e.target.value);
  }, [updateSettings]);

  const handleShowResultsCount = useCallback((e) => {
    updateSettings('showResultsCount', e.target.checked);
  }, [updateSettings]);

  const id = open ? 'settings-popover' : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <div className={classes.content}>
        <Typography variant="h4">Settings</Typography>

        <div className={classes.settings}>
          <FormLabel className={classes.formLabel}>Theme</FormLabel>

          <Paper className={classes.root}>
            <IconButton
              className={classes.iconButton}
              disableRipple
              disableFocusRipple
              size="small"
            >
              <span className={classes.themeSamplePrimary} />
              <span className={classes.themeSampleMain} />
            </IconButton>

            <Divider className={classes.divider} orientation="vertical" />

            <Select
              name="theme"
              value={theme}
              onChange={handleThemeChange}
              input={<CustomInput />}
            >
              {Object.keys(THEMES).map((t) => (
                <MenuItem key={t} value={t}>
                  <ListItemText primary={t} />
                </MenuItem>
              ))}
            </Select>
          </Paper>

          <FormControl className={classes.formControl}>
            <FormLabel className={classes.formLabel}>History</FormLabel>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showResultsCount}
                    onChange={handleShowResultsCount}
                    name="showResultsCount"
                  />
                }
                label="Show results count"
              />
            </FormGroup>
          </FormControl>
        </div>
      </div>
    </Popover>
  );
};

SettingsMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Element),
  ]),
};

SettingsMenu.defaultProps = {
  anchorEl: null,
};

export default SettingsMenu;
