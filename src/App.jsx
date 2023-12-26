import React, { useState, useEffect } from 'react';
import {
  createTheme, ThemeProvider, Container, Typography, Card, MenuItem, FormControl, InputLabel,
  Select, TextField, Button, CssBaseline
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
  const [selectedActivity, setSelectedActivity] = useState(Object.keys(activities)[0]);
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');
  const [timeInfo, setTimeInfo] = useState([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [easterEgg, setEasterEgg] = useState('');

  useEffect(() => {
    let timer;
    if (buttonPressed) {
      timer = setTimeout(() => {
        setEasterEgg('Tarık - Furkan - Yunus - Rümeysa');
        setButtonPressed(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [buttonPressed]);

  const handleActivityChange = (event) => {
    setSelectedActivity(event.target.value);
  };

  const handleCurrentTimeChange = (event) => {
    setCurrentTime(event.target.value);
  };

  const calculateFeasibility = () => {
    if (!currentTime) {
      setMessage('Please enter the current time.');
      return;
    }

    const activityDuration = activities[selectedActivity];
    const currentTimeDate = new Date(`01/01/2000 ${currentTime}`);
    const cutoffTime = new Date(currentTimeDate);
    cutoffTime.setMinutes(15, 0, 0); // Her saat xx:15'te sınıfa dönüş
    if (currentTimeDate.getMinutes() > 15) {
      cutoffTime.setHours(currentTimeDate.getHours() + 1);
    }

    const remainingTime = (cutoffTime - currentTimeDate) / 60000; // Dakikalara çevir

    if (activityDuration <= remainingTime) {
      const departureTime = new Date(cutoffTime.getTime() - activityDuration * 60000);
      setMessage(`You must leave ${selectedActivity} by ${departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to return on time.`);
      setTimeInfo([
        `Time Remaining Until Class: ${Math.floor(remainingTime)} minutes`,
        `Time Remaining to Depart: ${Math.floor(remainingTime - activityDuration)} minutes`
      ]);
    } else {
      setMessage(`Do not do ${selectedActivity} in this break!`);
      setTimeInfo([]);
    }
  };

  const handleButtonPress = () => {
    setButtonPressed(true);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      success: { main: '#4caf50' },
      error: { main: '#f44336' },
      info: { main: '#2196f3' }
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={calculateFeasibility}
            onMouseDown={handleButtonPress}
            onMouseUp={() => setButtonPressed(false)}
            onTouchStart={handleButtonPress}
            onTouchEnd={() => setButtonPressed(false)}
          >
            Check Feasibility
          </Button>
          {message && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: message.includes('not') || message.includes('Please enter') ? darkTheme.palette.error.main : darkTheme.palette.success.main }}>
              {message}
            </Typography>
          )}
          {timeInfo.length > 0 && timeInfo.map((line, index) => (
            <Typography key={index} variant="subtitle1" sx={{ mt: 2, color: darkTheme.palette.info.main }}>
              {line}
            </Typography>
          ))}
          {easterEgg && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: darkTheme.palette.info.main }}>
              {easterEgg}
            </Typography>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default App;
