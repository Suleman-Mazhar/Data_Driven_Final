import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { merchantsService, criticalItemsService, purchasesService } from '../services';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeLocations, setStoreLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [stockLevels, setStockLevels] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch store locations for the merchant
        try {
          const response = await merchantsService.getStoreLocations();
          const locations = response.data;
          
          setStoreLocations(locations);
          
          if (locations && locations.length > 0) {
            setSelectedLocation(locations[0]);
            await fetchStockLevels(locations[0].location_id);
            await fetchRecentPurchases(locations[0].location_id);
          }
        } catch (err) {
          console.error('Error fetching store locations:', err);
          // Fall back to mock data if the API call fails
          const mockStoreLocations = [
            {
              location_id: 'loc1',
              store_name: 'HealthPlus Central',
              address: '123 Main Street, Derby',
              city: 'Derby',
              postal_code: 'DE1 1AB'
            },
            {
              location_id: 'loc2',
              store_name: 'HealthPlus North',
              address: '456 North Road, Derby',
              city: 'Derby',
              postal_code: 'DE1 2CD'
            }
          ];
          
          setStoreLocations(mockStoreLocations);
          
          if (mockStoreLocations.length > 0) {
            setSelectedLocation(mockStoreLocations[0]);
            await fetchStockLevels(mockStoreLocations[0].location_id);
            await fetchRecentPurchases(mockStoreLocations[0].location_id);
          }
        }
        
        // Fetch critical items
        try {
          const criticalItemsResponse = await criticalItemsService.getCriticalItems();
          setCriticalItems(criticalItemsResponse.data);
        } catch (err) {
          console.error('Error fetching critical items:', err);
          // Fall back to mock data
          const mockCriticalItems = [
            {
              item_id: 'item1',
              name: 'N95 Face Mask',
              category: 'Medical',
              description: 'High-filtration protective face mask',
              is_restricted: true
            },
            {
              item_id: 'item2',
              name: 'Hand Sanitizer',
              category: 'Hygiene',
              description: '75% alcohol hand sanitizer',
              is_restricted: true
            },
            {
              item_id: 'item3',
              name: 'COVID-19 Test Kit',
              category: 'Testing',
              description: 'Rapid antigen test kit',
              is_restricted: true
            },
            {
              item_id: 'item4',
              name: 'Milk 4L',
              category: 'Grocery',
              description: 'Four-liter milk container',
              is_restricted: true
            }
          ];
          
          setCriticalItems(mockCriticalItems);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching merchant data:', err);
        setError('Failed to load merchant data. Please try again.');
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, []);

  const fetchStockLevels = async (locationId) => {
    try {
      // Try to get data from API
      const response = await merchantsService.getStockLevels(locationId);
      setStockLevels(response.data);
    } catch (err) {
      console.error('Error fetching stock levels:', err);
      setError('Failed to load stock levels. Please try again.');
      
      // Fall back to mock data
      const mockStockLevels = [
        {
          stock_id: 'stock1',
          item_id: 'item1',
          item_name: 'N95 Face Mask',
          category: 'Medical',
          quantity: 47,
          last_updated: '2025-05-12T14:30:00Z'
        },
        {
          stock_id: 'stock2',
          item_id: 'item2',
          item_name: 'Hand Sanitizer',
          category: 'Hygiene',
          quantity: 28,
          last_updated: '2025-05-13T09:15:00Z'
        },
        {
          stock_id: 'stock3',
          item_id: 'item3',
          item_name: 'COVID-19 Test Kit',
          category: 'Testing',
          quantity: 12,
          last_updated: '2025-05-13T16:45:00Z'
        },
        {
          stock_id: 'stock4',
          item_id: 'item4',
          item_name: 'Milk 4L',
          category: 'Grocery',
          quantity: 8,
          last_updated: '2025-05-14T08:20:00Z'
        }
      ];
      
      setStockLevels(mockStockLevels);
    }
  };

  const fetchRecentPurchases = async (locationId) => {
    try {
      // Try to get data from API
      const response = await purchasesService.getLocationPurchases(locationId, 10);
      setRecentPurchases(response.data);
    } catch (err) {
      console.error('Error fetching recent purchases:', err);
      setError('Failed to load recent purchases. Please try again.');
      
      // Fall back to mock data
      const mockPurchases = [
        {
          purchase_id: 'p1',
          item_name: 'N95 Face Mask',
          quantity: 2,
          purchase_time: '2025-05-14T10:30:00Z',
          status: 'completed'
        },
        {
          purchase_id: 'p2',
          item_name: 'Hand Sanitizer',
          quantity: 1,
          purchase_time: '2025-05-14T09:45:00Z',
          status: 'completed'
        },
        {
          purchase_id: 'p3',
          item_name: 'COVID-19 Test Kit',
          quantity: 1,
          purchase_time: '2025-05-13T16:20:00Z',
          status: 'completed'
        },
        {
          purchase_id: 'p4',
          item_name: 'Milk 4L',
          quantity: 1,
          purchase_time: '2025-05-13T14:15:00Z',
          status: 'completed'
        }
      ];
      
      setRecentPurchases(mockPurchases);
    }
  };

  const handleLocationChange = async (locationId) => {
    const location = storeLocations.find(loc => loc.location_id === locationId);
    setSelectedLocation(location);
    await fetchStockLevels(locationId);
    await fetchRecentPurchases(locationId);
  };

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setNewQuantity(item.quantity.toString());
    setUpdateDialogOpen(true);
  };

  const handleSaveStockUpdate = async () => {
    try {
      // Update stock via API
      await merchantsService.updateStockLevel({
        location_id: selectedLocation.location_id,
        item_id: selectedItem.item_id,
        quantity: parseInt(newQuantity, 10)
      });
      
      // Update local state
      const updatedStockLevels = stockLevels.map(item => 
        item.item_id === selectedItem.item_id 
          ? {...item, quantity: parseInt(newQuantity, 10), last_updated: new Date().toISOString()} 
          : item
      );
      
      setStockLevels(updatedStockLevels);
      setUpdateDialogOpen(false);
    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Failed to update stock. Please try again.');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Merchant Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome, {user?.name || 'Merchant'}. Manage your store inventory and view purchase history.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Store Location Selector */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Store Location
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={selectedLocation?.location_id || ''}
              label="Location"
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {storeLocations.map((location) => (
                <MenuItem key={location.location_id} value={location.location_id}>
                  {location.store_name} - {location.city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        
        {selectedLocation && (
          <>
            {/* Stock Levels */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Current Stock Levels
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={() => fetchStockLevels(selectedLocation.location_id)}
                >
                  Refresh
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockLevels.map((item) => (
                      <TableRow key={item.stock_id}>
                        <TableCell>{item.item_name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right" sx={{
                          color: item.quantity <= 5 ? 'error.main' : 
                                 item.quantity <= 10 ? 'warning.main' : 
                                 'text.primary'
                        }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell>{formatDateTime(item.last_updated)}</TableCell>
                        <TableCell align="right">
                          <Button 
                            size="small" 
                            variant="contained"
                            onClick={() => handleUpdateStock(item)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            {/* Recent Purchases */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Purchases
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Date/Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPurchases.map((purchase) => (
                      <TableRow key={purchase.purchase_id}>
                        <TableCell>{purchase.item_name}</TableCell>
                        <TableCell align="right">{purchase.quantity}</TableCell>
                        <TableCell>{formatDateTime(purchase.purchase_time)}</TableCell>
                        <TableCell>{purchase.status}</TableCell>
                      </TableRow>
                    ))}
                    {recentPurchases.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No recent purchases
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
      
      {/* Stock Update Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Stock Level</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              {selectedItem?.item_name}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="quantity"
              label="New Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveStockUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MerchantDashboard; 