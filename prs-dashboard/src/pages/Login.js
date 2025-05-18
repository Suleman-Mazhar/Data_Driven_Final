import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [prs_id, setPrsId] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(prs_id, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async (demoId) => {
    const success = await login(demoId, 'password');
    if (success) {
      navigate('/dashboard');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            PRS System Login
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="prs_id"
              label="PRS ID"
              name="prs_id"
              autoComplete="username"
              autoFocus
              value={prs_id}
              onChange={(e) => setPrsId(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Box>
          </Box>

          <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Quick Demo Access
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Public User
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PRS ID: PRS123456
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleDemoLogin('PRS123456')}
                  >
                    Login as Public
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Merchant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PRS ID: PRS234567
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleDemoLogin('PRS234567')}
                  >
                    Login as Merchant
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Government
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PRS ID: GOVPRS789
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleDemoLogin('GOVPRS789')}
                  >
                    Login as Gov
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;