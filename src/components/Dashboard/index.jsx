import React, { useEffect, useState } from 'react';
import {
  Grid,
  Breadcrumbs,
  Link,
  Typography,
} from '@material-ui/core';
import Layout from '../Layout';
import MostVisitedSite from './MostVisitedSite';
import TotalUniqueSites from './TotalUniqueSites';
import TopCategory from './TopCategory';
import EstimatedTimeBrowsing from './PercentChange';
import TopSitesCard from './TopSitesCard';
import WeeklyUsageCard from './WeeklyUsageCard';
import CategoryPie from './CategoryPie';
import SkeletonCardSmall from './SkeletonCardSmall';
import TopSitesSkeleton from './TopSitesSkeleton';
import { getSearchParams, searchHistory } from '../../lib/helpers/chrome-helpers';
import {
  groupHistoryByDate,
  groupHistoryByHour,
  enrichHistory,
} from '../../lib/helpers/history-helpers';

const EMPTY_HISTORY = {
  data: [],
  timeData: [],
  mostVisited: 'NA',
  topCategory: 'NA',
  totalUniqueSites: 'NA',
  percentChange: 'NA',
  categoryBreakdown: [],
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(EMPTY_HISTORY);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const searchParams = getSearchParams('', 'Fourteen', {}, 10000);
        const results = await searchHistory(searchParams);

        if (!isMounted) return;

        if (!results?.length) {
          setHistory(EMPTY_HISTORY);
        } else {
          const groupedByDate = groupHistoryByDate(results);
          const groupedByHour = groupHistoryByHour(results);
          const enriched = enrichHistory(groupedByDate);

          setHistory({
            ...enriched,
            timeData: groupedByHour,
          });
        }
      } catch (error) {
        console.error('Error getting history', error);
        if (isMounted) setHistory(EMPTY_HISTORY);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false; // prevents state update on unmounted component
    };
  }, []);

  return (
    <Layout>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Insights
            </Link>
            <Typography color="textPrimary">Dashboard</Typography>
          </Breadcrumbs>

          <Typography variant="h3">
            This week&#39;s overview
          </Typography>
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <MostVisitedSite value={history.mostVisited} />}
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <TotalUniqueSites value={history.totalUniqueSites} />}
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <TopCategory value={history.topCategory} />}
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <EstimatedTimeBrowsing value={history.percentChange} />}
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <TopSitesSkeleton /> : <CategoryPie data={history.categoryBreakdown} />}
        </Grid>

        <Grid item xs={9}>
          {isLoading ? (
            <TopSitesSkeleton />
          ) : (
            <WeeklyUsageCard
              data={history.data}
              title="Last 7 days by category"
              chartType="category"
            />
          )}
        </Grid>

        <Grid item xs={3}>
          {isLoading ? <TopSitesSkeleton /> : <TopSitesCard />}
        </Grid>

        <Grid item xs={9}>
          {isLoading ? (
            <TopSitesSkeleton />
          ) : (
            <WeeklyUsageCard
              data={history.timeData}
              title="Last 7 days by hour"
              chartType="time"
            />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
