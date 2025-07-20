import { Container, Typography } from "@mui/material";
import CrimeGridMap from "./components/CrimeGridMap";
import CrimeHeatMap from "./components/CrimeHeatMap";


function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carte des crimes NYPD
      </Typography>
      <CrimeHeatMap />
    </Container>
  );
}

export default App;
