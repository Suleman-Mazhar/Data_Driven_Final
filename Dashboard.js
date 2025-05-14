import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const StatCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color={color || 'primary'}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        setTimeout(() => {
          setStats({
            counts: {
              individuals: 1254,
              merchants: 87,
              locations: 142,
              vaccinations: 3218,
              purchases_7d: 892,
              low_stock: 12,
              alerts: 5
            },
            charts: {
              purchase_trend: [
                { date: '2025-05-07', count: 105 },
                { date: '2025-05-08', count: 120 },
                { date: '2025-05-09', count: 135 },
                { date: '2025-05-10', count: 150 },
                { date: '2025-05-11', count: 145 },
                { date: '2025-05-12', count: 160 },
                { date: '2025-05-13', count: 175 }
              ],
              top_items: [
                { name: 'N95 Face Mask', count: 450 },
                { name: 'Hand Sanitizer', count: 320 },
                { name: 'COVID-19 Test Kit', count: 280 },
                { name: 'Milk 4L', count: 210 },
                { name: 'Toilet Paper', count: 180 }
              ]
            }
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    if (hasRole('government_official')) {
      fetchDashboardData();
    }
  }, [hasRole]);

  if (!hasRole('government_official')) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have permission to view the government dashboard.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Government Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome, {user?.name}. Here's the current pandemic situation overview.
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Registered Individuals" 
              value={stats.counts.individuals.toLocaleString()} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active Merchants" 
              value={stats.counts.merchants.toLocaleString()} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Vaccination Records" 
              value={stats.counts.vaccinations.toLocaleString()} 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Purchases (7d)" 
              value={stats.counts.purchases_7d.toLocaleString()} 
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Alert Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Low Stock Items" 
              value={stats.counts.low_stock.toLocaleString()} 
              color={stats.counts.low_stock > 10 ? "error.main" : "success.main"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Unresolved Alerts" 
              value={stats.counts.alerts.toLocaleString()} 
              color={stats.counts.alerts > 5 ? "error.main" : "success.main"}
            />
          </Grid>
        </Grid>
        
        {/* Charts */}
        <Grid container spacing={3}>
          {/* Purchase Trend Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Purchase Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stats.charts.purchase_trend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    name="Purchases" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Top Items Chart */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Top 5 Items (By Purchase)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={stats.charts.top_items}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" scale="band" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Purchase Count" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;