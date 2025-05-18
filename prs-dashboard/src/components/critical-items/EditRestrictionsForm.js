import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Box,
  Chip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axios from 'axios';

const EditRestrictionsForm = ({ open, onClose, item, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    max_quantity: '',
    time_period: 'weekly',
    dob_pattern: '',
    allowed_days: '',
    effective_from: new Date(),
    effective_to: null,
    is_restricted: true
  });
  
  // Initialize form with item data
  useEffect(() => {
    if (item) {
      setFormData({
        max_quantity: item.max_quantity || '',
        time_period: item.time_period || 'weekly',
        dob_pattern: item.dob_pattern || '',
        allowed_days: item.allowed_days || '',
        effective_from: new Date(),
        effective_to: null,
        is_restricted: item.is_restricted !== false // Default to true if not specified
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const validateForm = () => {
    const errors = [];
    
    if (formData.is_restricted) {
      if (!formData.max_quantity || formData.max_quantity < 1) {
        errors.push('Valid maximum quantity is required');
      }
      
      if (!formData.time_period) {
        errors.push('Time period is required');
      }
      
      if (!formData.dob_pattern) {
        errors.push('DOB pattern is required (e.g., "0,2,4,6,8" for years ending in those digits)');
      } else {
        // Check if DOB pattern is valid (comma-separated digits 0-9)
        const dobPattern = formData.dob_pattern.split(',');
        const isValid = dobPattern.every(digit => /^[0-9]$/.test(digit.trim()));
        if (!isValid) {
          errors.push('DOB pattern should be comma-separated digits (0-9)');
        }
      }
      
      if (!formData.allowed_days) {
        errors.push('Allowed days is required (e.g., "1,3,5" for Monday, Wednesday, Friday)');
      } else {
        // Check if allowed days is valid (comma-separated digits 1-7)
        const allowedDays = formData.allowed_days.split(',');
        const isValid = allowedDays.every(day => /^[1-7]$/.test(day.trim()));
        if (!isValid) {
          errors.push('Allowed days should be comma-separated digits (1-7, where 1=Monday, 7=Sunday)');
        }
      }
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Format dates
      const formattedData = {
        ...formData,
        effective_from: formData.effective_from ? format(formData.effective_from, 'yyyy-MM-dd') : null,
        effective_to: formData.effective_to ? format(formData.effective_to, 'yyyy-MM-dd') : null
      };
      
      // In a real implementation, this would call your API
      // await axios.put(`/api/critical-items/${item.item_id}`, formattedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Notify parent component
      if (onSuccess) {
        onSuccess({
          ...item,
          ...formattedData
        });
      }
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update restrictions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Restrictions for {item?.name}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            Restrictions updated successfully!
          </Alert>
        )}
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Restriction Status
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="is-restricted-label">Item Status</InputLabel>
              <Select
                labelId="is-restricted-label"
                name="is_restricted"
                value={formData.is_restricted}
                onChange={(e) => setFormData({ ...formData, is_restricted: e.target.value })}
                label="Item Status"
              >
                <MenuItem value={true}>Restricted (Purchase Limits Apply)</MenuItem>
                <MenuItem value={false}>Unrestricted (No Purchase Limits)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {formData.is_restricted && (
            <>
              <Grid item xs={12}>
                <Divider>
                  <Chip label="Purchase Limits" />
                </Divider>
              </Grid>
            
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Quantity"
                  name="max_quantity"
                  type="number"
                  value={formData.max_quantity}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1 }}
                  helperText="Maximum units per time period"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="time-period-label">Time Period</InputLabel>
                  <Select
                    labelId="time-period-label"
                    name="time_period"
                    value={formData.time_period}
                    onChange={handleChange}
                    label="Time Period"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                  <FormHelperText>Limit reset period</FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider>
                  <Chip label="Purchase Schedule" />
                </Divider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DOB Pattern"
                  name="dob_pattern"
                  value={formData.dob_pattern}
                  onChange={handleChange}
                  required
                  helperText="Comma-separated digits (0-9) of year-ending"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Allowed Days"
                  name="allowed_days"
                  value={formData.allowed_days}
                  onChange={handleChange}
                  required
                  helperText="Comma-separated days (1=Mon, 2=Tue, etc.)"
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Divider>
              <Chip label="Effective Period" />
            </Divider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Effective From"
                value={formData.effective_from}
                onChange={(date) => handleDateChange('effective_from', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required helperText="When restrictions begin" />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Effective To"
                value={formData.effective_to}
                onChange={(date) => handleDateChange('effective_to', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth helperText="When restrictions end (leave blank for indefinite)" />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Note: Changes to restrictions will apply from the effective date. Existing purchase history will not be affected.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRestrictionsForm; 