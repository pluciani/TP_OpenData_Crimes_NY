import { Container, Typography } from "@mui/material";
import CrimeMap from "./components/CrimeMap";

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carte des crimes NYPD
      </Typography>
      <CrimeMap />
    </Container>
  );
}

export default App;
