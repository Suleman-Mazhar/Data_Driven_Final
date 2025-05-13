import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const CriticalItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    // This would normally fetch data from your API
    // For now, we'll use dummy data
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const dummyItems = [
            {
              item_id: '1',
              name: 'N95 Face Mask',
              category: 'Medical',
              description: 'High-filtration protective face mask',
              is_restricted: true,
              max_quantity: 7,
              time_period: 'weekly'
            },
            {
              item_id: '2',
              name: 'Hand Sanitizer',
              category: 'Hygiene',
              description: '75% alcohol hand sanitizer',
              is_restricted: true,
              max_quantity: 3,
              time_period: 'weekly'
            },
            {
              item_id: '3',
              name: 'COVID-19 Test Kit',
              category: 'Testing',
              description: 'Rapid antigen test kit',
              is_restricted: true,
              max_quantity: 2,
              time_period: 'weekly'
            },
            {
              item_id: '4',
              name: 'Milk 4L',
              category: 'Grocery',
              description: 'Four-liter milk container',
              is_restricted: true,
              max_quantity: 2,
              time_period: 'daily'
            }
          ];
          setItems(dummyItems);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load critical items. Please try again.');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Critical Items
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          These items have purchase restrictions during pandemic situations.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.item_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Chip 
                    label={item.category} 
                    size="small" 
                    color="primary" 
                    sx={{ mt: 1, mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Purchase Limit:</strong> {item.max_quantity} per {item.time_period}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Find Nearby</Button>
                  {hasRole('government_official') && (
                    <Button size="small" color="secondary">Edit Restrictions</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CriticalItems;