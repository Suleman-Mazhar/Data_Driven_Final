import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  CircularProgress,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useLocation } from 'react-router-dom';
import { getAvailableItems } from '../services/api';

const CriticalItemsMap = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [radius, setRadius] = useState(10);
  const [selectedStore, setSelectedStore] = useState(null);
  const [filterByItem, setFilterByItem] = useState(null);
  
  // Get the selected item from the navigation state
  const routeLocation = useLocation();
  const selectedItemId = routeLocation.state?.selectedItemId;
  const selectedItemName = routeLocation.state?.selectedItemName;
  
  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // If we have an item selected, automatically search when location is available
          if (selectedItemId) {
            setFilterByItem(selectedItemId);
            setTimeout(() => {
              handleSearch(position.coords.latitude, position.coords.longitude, selectedItemId);
            }, 500);
          }
        },
        () => {
          setError("Unable to retrieve your location. Please enter it manually.");
          // Default to Derby, England
          setLocation({ lat: 52.9225, lng: -1.4746 });
          
          // If we have an item selected, automatically search with default location
          if (selectedItemId) {
            setFilterByItem(selectedItemId);
            setTimeout(() => {
              handleSearch(52.9225, -1.4746, selectedItemId);
            }, 500);
          }
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      // Default to Derby, England
      setLocation({ lat: 52.9225, lng: -1.4746 });
    }
  }, [selectedItemId]);
  
  const handleRadiusChange = (event, newValue) => {
    setRadius(newValue);
  };
  
  const handleFilterChange = (event) => {
    setFilterByItem(event.target.value);
  };
  
  const handleSearch = async (lat = location.lat, lng = location.lng, itemId = filterByItem) => {
    if (!lat || !lng) {
      setError("Please provide your location");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAvailableItems(lat, lng, radius);
      let filteredStores = response.data;
      
      // If a specific item is selected, filter stores that have that item
      if (itemId) {
        // Filter stores that have the selected item
        filteredStores = filteredStores.filter(store => 
          store.items.some(item => item.item_id === itemId)
        );
        
        // Sort by proximity
        filteredStores.sort((a, b) => a.distance - b.distance);
      }
      
      setStores(filteredStores);
      setSelectedStore(null);
    } catch (err) {
      console.error('Failed to fetch available items:', err);
      setError('Failed to load available items. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };
  
  // Get the list of all unique items from all stores for the filter dropdown
  const getAllItems = () => {
    const allItems = [];
    stores.forEach(store => {
      store.items.forEach(item => {
        if (!allItems.some(i => i.item_id === item.item_id)) {
          allItems.push(item);
        }
      });
    });
    return allItems;
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Critical Items Near You
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Search for available critical items at stores near your location.
        </Typography>
        
        {selectedItemName && (
          <Chip 
            label={`Showing locations with: ${selectedItemName}`}
            color="primary"
            sx={{ mb: 2 }}
            onDelete={() => {
              setFilterByItem(null);
              handleSearch(location.lat, location.lng, null);
            }}
          />
        )}
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Latitude"
                type="number"
                fullWidth
                value={location.lat || ''}
                onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Longitude"
                type="number"
                fullWidth
                value={location.lng || ''}
                onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography id="radius-slider" gutterBottom>
                Search Radius: {radius} km
              </Typography>
              <Slider
                value={radius}
                onChange={handleRadiusChange}
                aria-labelledby="radius-slider"
                min={1}
                max={50}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => handleSearch()}
                disabled={loading || !location.lat || !location.lng}
              >
                Search
              </Button>
            </Grid>
            
            {stores.length > 0 && !selectedItemId && (
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="filter-by-item-label">Filter by Item</InputLabel>
                  <Select
                    labelId="filter-by-item-label"
                    value={filterByItem || ''}
                    onChange={handleFilterChange}
                    label="Filter by Item"
                    displayEmpty
                  >
                    <MenuItem value="">All Items</MenuItem>
                    {getAllItems().map(item => (
                      <MenuItem key={item.item_id} value={item.item_id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" padding={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Nearby Stores ({stores.length})
                </Typography>
                
                {stores.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                    {selectedItemName ? 
                      `No stores found with ${selectedItemName} in this area.` :
                      'No stores found with available items in this area.'}
                  </Typography>
                ) : (
                  <List>
                    {stores.map((store) => (
                      <ListItem 
                        key={store.location_id}
                        button
                        onClick={() => handleStoreSelect(store)}
                        selected={selectedStore?.location_id === store.location_id}
                        divider
                      >
                        <ListItemIcon>
                          <LocationOnIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={store.store_name}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {store.business_name}
                              </Typography>
                              <br />
                              {store.address}, {store.city}
                              <br />
                              {store.distance.toFixed(1)} km away • {store.items.length} items available
                              {filterByItem && (
                                <>
                                  <br />
                                  <Typography component="span" variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                    {store.items.find(item => item.item_id === filterByItem)?.quantity || 0} units available
                                  </Typography>
                                </>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={7}>
              {selectedStore ? (
                <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedStore.store_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    {selectedStore.business_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedStore.address}<br />
                    {selectedStore.city}, {selectedStore.postal_code}<br />
                    {selectedStore.distance.toFixed(2)} km from your location
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Available Items
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {selectedStore.items
                      .filter(item => filterByItem ? item.item_id === filterByItem : true)
                      .map((item) => (
                        <Grid item xs={12} sm={6} key={item.item_id}>
                          <Card variant="outlined" sx={{ 
                            bgcolor: filterByItem === item.item_id ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                          }}>
                            <CardContent>
                              <Typography variant="h6" component="div">
                                {item.name}
                              </Typography>
                              <Typography color="text.secondary">
                                {item.category}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {item.quantity} units available
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                    ))}
                  </Grid>
                </Paper>
              ) : (
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '600px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}
                >
                  <Typography color="text.secondary">
                    Select a store to view available items
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CriticalItemsMap;