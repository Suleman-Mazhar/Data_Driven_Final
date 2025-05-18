import React, { useState } from 'react';
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
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vaccination-tabpanel-${index}`}
      aria-labelledby={`vaccination-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VaccinationUploadForm = ({ open, onClose, onSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  
  // Manual entry form state
  const [manualForm, setManualForm] = useState({
    vaccine_name: '',
    manufacturer: '',
    dose_number: 1,
    vaccination_date: null,
    location: ''
  });
  
  // File upload state
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  
  // FHIR data state
  const [fhirData, setFhirData] = useState('');
  const [fhirError, setFhirError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(false);
  };

  const handleManualFormChange = (e) => {
    const { name, value } = e.target;
    setManualForm({
      ...manualForm,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setManualForm({
      ...manualForm,
      vaccination_date: date
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setFileError(null);
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError('Only PDF, JPEG, and PNG files are supported');
      setFile(null);
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setFileError(null);
  };

  const handleFhirDataChange = (e) => {
    setFhirData(e.target.value);
  };

  const validateManualForm = () => {
    if (!manualForm.vaccine_name) return 'Vaccine name is required';
    if (!manualForm.manufacturer) return 'Manufacturer is required';
    if (!manualForm.dose_number || manualForm.dose_number < 1) return 'Valid dose number is required';
    if (!manualForm.vaccination_date) return 'Vaccination date is required';
    return null;
  };

  const validateFhirData = () => {
    if (!fhirData.trim()) return 'FHIR data is required';
    
    try {
      JSON.parse(fhirData);
      return null;
    } catch (e) {
      return 'Invalid JSON format for FHIR data';
    }
  };

  const handleManualSubmit = async () => {
    const validationError = validateManualForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Format the date as YYYY-MM-DD
      const formattedDate = format(manualForm.vaccination_date, 'yyyy-MM-dd');
      
      // In a real implementation, this would call your API
      // For now, we'll simulate the API call
      // await axios.post('/api/vaccinations', {
      //   ...manualForm,
      //   vaccination_date: formattedDate
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If there's a file, upload it
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('vaccination_id', 'vacc-' + Date.now()); // Mock ID
        
        // In a real implementation, this would call your API
        // await axios.post('/api/vaccinations/vacc-123/documents', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setSuccess(true);
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after success
      setManualForm({
        vaccine_name: '',
        manufacturer: '',
        dose_number: 1,
        vaccination_date: null,
        location: ''
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload vaccination record');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      setFileError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // In a real implementation, this would call your API
      // await axios.post('/api/vaccinations/document-upload', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset file after success
      setFile(null);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload vaccination document');
    } finally {
      setLoading(false);
    }
  };

  const handleFhirSubmit = async () => {
    const validationError = validateFhirData();
    if (validationError) {
      setFhirError(validationError);
      return;
    }
    
    setLoading(true);
    setError(null);
    setFhirError(null);
    setSuccess(false);
    
    try {
      // Parse JSON to validate
      const fhirJsonData = JSON.parse(fhirData);
      
      // In a real implementation, this would call your API
      // await axios.post('/api/vaccinations/fhir', fhirJsonData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after success
      setFhirData('');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setFhirError('Invalid JSON format');
      } else {
        setFhirError(err.response?.data?.error || 'Failed to process FHIR data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (tabValue === 0) {
      handleManualSubmit();
    } else if (tabValue === 1) {
      handleFileSubmit();
    } else {
      handleFhirSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Vaccination Record</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Manual Entry" />
          <Tab label="Document Upload" />
          <Tab label="FHIR Data" />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Vaccination record uploaded successfully!
          </Alert>
        )}
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vaccine Name"
                name="vaccine_name"
                value={manualForm.vaccine_name}
                onChange={handleManualFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Manufacturer"
                name="manufacturer"
                value={manualForm.manufacturer}
                onChange={handleManualFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dose Number"
                name="dose_number"
                type="number"
                value={manualForm.dose_number}
                onChange={handleManualFormChange}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Vaccination Date"
                  value={manualForm.vaccination_date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={manualForm.location}
                onChange={handleManualFormChange}
                placeholder="e.g., Hospital, Clinic, Pharmacy name"
              />
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload a vaccination certificate or proof document (PDF, JPEG, PNG)
              </Typography>
              <TextField
                type="file"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                error={!!fileError}
                helperText={fileError}
              />
            </Grid>
            {file && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Alert>
              </Grid>
            )}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Paste your FHIR JSON vaccination data below
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                value={fhirData}
                onChange={handleFhirDataChange}
                error={!!fhirError}
                helperText={fhirError}
              />
            </Grid>
          </Grid>
        </TabPanel>
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
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VaccinationUploadForm; 