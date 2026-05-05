/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import CustomDrawer from './components/CustomDrawer';
import History from './components/History';
import Dashboard from './components/Dashboard';
import DeleteToolbar from './components/DeleteToolbar';
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog';
import FeedbackDialog from './components/FeedbackDialog';
import {
  searchHistory,
  getSearchParams,
  deleteHistoryItems,
  deleteAllHistory,
} from './lib/helpers/chrome-helpers';
import { groupHistoryByDate } from './lib/helpers/history-helpers';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

const App = () => {
  const classes = useStyles();

  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [range, setRange] = useState('Today');
  const [customRange, setCustomRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [maxResults, setMaxResults] = useState(10000);

  const [history, setHistory] = useState([]);

  // 🔁 Fetch history
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const searchParams = getSearchParams(searchText, range, customRange, maxResults);
        const results = await searchHistory(searchParams);
        if (!isMounted) return;

        setHistory(groupHistoryByDate(results));
      } catch (error) {
        console.error('Error getting history', error);
        if (isMounted) setHistory([]);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [searchText, range, customRange, maxResults]);

  // 🔄 Refresh manually (after delete)
  const refreshHistory = useCallback(() => {
    setSearchText((prev) => prev); // triggers effect without fake state
  }, []);

  const handleUpdateRange = (val) => {
    setShowDashboard(false);
    if (val === 'Custom') setShowControls(true);
    setRange(val);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
    setRange(null);
  };

  const getSelectedIndex = useCallback(
    (item) => selectedForDelete.findIndex((e) => e.lastVisitTime === item.lastVisitTime),
    [selectedForDelete]
  );

  const toggleSelectItem = (item) => {
    setSelectedForDelete((prev) => {
      const exists = prev.some((e) => e.lastVisitTime === item.lastVisitTime);
      return exists
        ? prev.filter((e) => e.lastVisitTime !== item.lastVisitTime)
        : [...prev, item];
    });
  };

  const handleDeleteItems = async () => {
    try {
      await deleteHistoryItems(selectedForDelete);
      setSelectedForDelete([]);
      refreshHistory();
    } catch (error) {
      console.error('Error deleting selected history items', error);
    }
  };

  const handleDeleteSingleItem = async (item) => {
    try {
      await deleteHistoryItems([item]);
      setSelectedForDelete([]);
      refreshHistory();
    } catch (error) {
      console.error('Error deleting single history item', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllHistory();
      setShowConfirmDelete(false);
      refreshHistory();
    } catch (error) {
      console.error('Error deleting all history', error);
    }
  };

  const showDeleteToolbar = selectedForDelete.length > 0;

  return (
    <div className={classes.root}>
      <SettingsProvider>
        <ThemeProvider>
          <CssBaseline />

          <ConfirmDeleteDialog
            open={showConfirmDelete}
            deleteAll={handleDeleteAll}
            cancel={() => setShowConfirmDelete(false)}
          />

          {showFeedbackForm && (
            <FeedbackDialog
              open={showFeedbackForm}
              cancel={() => setShowFeedbackForm(false)}
            />
          )}

          {showDeleteToolbar ? (
            <DeleteToolbar
              count={selectedForDelete.length}
              cancel={() => setSelectedForDelete([])}
              deleteItems={handleDeleteItems}
            />
          ) : (
            <Header />
          )}

          <CustomDrawer
            range={range}
            handleUpdateRange={handleUpdateRange}
            handleShowDashboard={handleShowDashboard}
            handleShowFeedbackForm={() => setShowFeedbackForm(true)}
          />

          {!showDashboard ? (
            <History
              history={history}
              searchText={searchText}
              setSearchText={setSearchText}
              showControls={showControls}
              setShowControls={setShowControls}
              handleDeleteAll={() => setShowConfirmDelete(true)}
              range={range}
              handleUpdateRange={handleUpdateRange}
              customRange={customRange}
              handleUpdateCustomRange={setCustomRange}
              maxResults={maxResults}
              setMaxResults={setMaxResults}
              getSelectedForDeleteIndex={getSelectedIndex}
              handleSelectedForDelete={toggleSelectItem}
              handleMoreFromThisSite={(text) => {
                setSearchText(text);
                setShowControls(true);
              }}
              handleDeleteSingleItem={handleDeleteSingleItem}
            />
          ) : (
            <Dashboard />
          )}
        </ThemeProvider>
      </SettingsProvider>
    </div>
  );
};

export default App;
