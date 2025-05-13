import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import { useAuth } from '../context/AuthContext';

const VaccinationRecords = () => {
  const [records, setRecords] = useState([
    {
      vaccination_id: '1',
      vaccine_name: 'COVID-19 Vaccine AstraZeneca',
      manufacturer: 'AstraZeneca Ltd',
      dose_number: 1,
      vaccination_date: '2023-01-15',
      verification_status: 'verified',
      has_document: true,
      has_fhir: true
    },
    {
      vaccination_id: '2',
      vaccine_name: 'COVID-19 Vaccine AstraZeneca',
      manufacturer: 'AstraZeneca Ltd',
      dose_number: 2,
      vaccination_date: '2023-02-12',
      verification_status: 'verified',
      has_document: true,
      has_fhir: true
    },
    {
      vaccination_id: '3',
      vaccine_name: 'COVID-19 Vaccine Pfizer',
      manufacturer: 'Pfizer Inc',
      dose_number: 3,
      vaccination_date: '2023-09-05',
      verification_status: 'pending',
      has_document: true,
      has_fhir: false
    }
  ]);
  
  const { hasRole } = useAuth();
  
  const handleVerify = (id) => {
    setRecords(records.map(record => 
      record.vaccination_id === id 
        ? {...record, verification_status: 'verified'} 
        : record
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Vaccination Records
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View and manage your vaccination history.
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
        >
          Upload New Vaccination
        </Button>
        
        <Paper sx={{ p: 2 }}>
          <List>
            {records.map((record) => (
              <React.Fragment key={record.vaccination_id}>
                <ListItem 
                  secondaryAction={
                    record.verification_status === 'pending' && hasRole('government_official') ? (
                      <Button 
                        color="primary" 
                        variant="contained"
                        onClick={() => handleVerify(record.vaccination_id)}
                      >
                        Verify
                      </Button>
                    ) : null
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6">
                          {record.vaccine_name} (Dose {record.dose_number})
                        </Typography>
                        {record.verification_status === 'verified' ? (
                          <Chip 
                            icon={<VerifiedIcon />} 
                            label="Verified" 
                            color="success" 
                            size="small" 
                            sx={{ ml: 2 }}
                          />
                        ) : (
                          <Chip 
                            icon={<PendingIcon />} 
                            label="Pending Verification" 
                            color="warning" 
                            size="small" 
                            sx={{ ml: 2 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Manufacturer:</strong> {record.manufacturer}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Vaccination Date:</strong> {record.vaccination_date}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {record.has_document && (
                            <Button 
                              size="small" 
                              startIcon={<DownloadIcon />}
                              sx={{ mr: 1 }}
                            >
                              PDF Certificate
                            </Button>
                          )}
                          {record.has_fhir && (
                            <Button 
                              size="small" 
                              startIcon={<DownloadIcon />}
                            >
                              FHIR Data
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default VaccinationRecords;