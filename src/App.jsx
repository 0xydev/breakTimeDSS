import React, { useState } from 'react';
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  Card,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
  Box,
  CssBaseline
} from '@mui/material';

const activities = {
  'Cafeteria': 7,
  'Grocery Store': 9,
  'Restroom': 5,
  'Professor Office': 6,
  'Hanging out with friends': 8,
  'Smoking': 10
};

const App = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');

  const handleActivityChange = (event) => {
    setSelectedActivity(event.target.value);
  };

  const handleCurrentTimeChange = (event) => {
    setCurrentTime(event.target.value);
  };

  const calculateFeasibility = () => {
    const activityDuration = activities[selectedActivity];
    const currentTimeDate = new Date(`01/01/2000 ${currentTime}`);
    const nextCutoffTime = new Date(currentTimeDate);
    nextCutoffTime.setMinutes((Math.floor(currentTimeDate.getMinutes() / 15) + 1) * 15, 0, 0);
    if (currentTimeDate.getMinutes() > 45) {
      nextCutoffTime.setHours(currentTimeDate.getHours() + 1);
    }
    const remainingTime = (nextCutoffTime - currentTimeDate) / 60000; // Convert to minutes

    if (activityDuration <= remainingTime) {
      const departureTime = new Date(nextCutoffTime.getTime() - activityDuration * 60000);
      setMessage(`You can do ${selectedActivity}. Leave by ${departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to return on time.`);
    } else {
      setMessage(`Do not do ${selectedActivity} in this break!`);
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      success: { main: '#4caf50' },
      error: { main: '#f44336' },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>CSU Break Time DSS</Typography>
        <Card sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Activity</InputLabel>
            <Select value={selectedActivity} label="Activity" onChange={handleActivityChange}>
              {Object.keys(activities).map((activityName) => (
                <MenuItem key={activityName} value={activityName}>
                  {activityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Current Time"
            type="time"
            value={currentTime}
            onChange={handleCurrentTimeChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={calculateFeasibility}>
            Check Feasibility
          </Button>
          {message && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: message.includes('not') ? darkTheme.palette.error.main : darkTheme.palette.success.main }}>
              {message}
            </Typography>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default App;
