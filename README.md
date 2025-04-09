# Data Producer Visualization Tool

# Technologies

- React
- Typescript
- Vite
- MaterialUI
- ChartJS

# Features

- Displays real-time data for up to 10 data producers
- User can toggle different producers on and off
- User can specify time frame in which to view a subset of the given data
- User can enable/disable data decimation to view data trends

# TODOs

- Handle socket disconnections gracefully and attempt re-connect
- Investigate socket error events
- Make data decimation sample sizes configurable
- Test different options for message buffering to decrease re-renders without obvious visual lag to the user
- Add color picker for producer configuration
- Add custom tooltip for displaying min/max/avg values
