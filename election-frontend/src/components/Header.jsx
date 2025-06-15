import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Header({ onLoginClick, onSignupClick }) {
  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(16, 32, 213, 0.7)",
        backdropFilter: "blur(8px)",
        boxShadow: "none",
      }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Brand Name */}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", cursor: "pointer" }}>
          Election Portal
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* Dummy Buttons */}
          <Button color="inherit">About</Button>
          <Button color="inherit">Features</Button>
          <Button color="inherit">Contact</Button>
          <Button color="inherit">Support</Button>
          <Button color="inherit">FAQs</Button>

          {/* Functional Buttons */}
          <Button color="inherit" onClick={onLoginClick}>
            Login
          </Button>
          <Button color="inherit" onClick={onSignupClick}>
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
