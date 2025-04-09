import Producers from "./components/Producers";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";

const producers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Producers producers={producers} />
    </ThemeProvider>
  );
}

export default App;
