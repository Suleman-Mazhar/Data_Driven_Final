import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    first_name: 'John',
    last_name: 'Doe',
    dob: '1985-06-15',
    is_minor: false
  });
  
  const [identifiers, setIdentifiers] = useState([
    {
      identifier_id: '1',
      identifier_type: 'passport',
      expiry_date: '2027-03-22',
      is_primary: true
    },
    {
      identifier_id: '2',
      identifier_type: 'driving_license',
      expiry_date: '2025-09-10',
      is_primary: false
    }
  ]);
  
  const [editMode, setEditMode] = useState(false);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    // Would save to API in real implementation
    setEditMode(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Manage your personal information and identification documents.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button 
                  startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                >
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>PRS ID:</strong> {user?.prs_id || 'PRS123456'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">User Roles</Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {user?.roles?.map(role => (
                  <Chip key={role} label={role} color="primary" />
                )) || (
                  <>
                    <Chip label="public" color="primary" />
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">National Identifiers</Typography>
                <Button startIcon={<EditIcon />}>
                  Add New
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {identifiers.map((identifier) => (
                  <ListItem key={identifier.identifier_id}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                            {identifier.identifier_type.replace('_', ' ')}
                          </Typography>
                          {identifier.is_primary && (
                            <Chip 
                              label="Primary" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Expires: {identifier.expiry_date}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;