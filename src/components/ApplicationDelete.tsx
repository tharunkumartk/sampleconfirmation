import {
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { deleteApplication, isAdmin } from "../utils/AtlasAPI";
import { LoadingButton } from "@mui/lab";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ApplicationDelete = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleUpload = async () => {
    // make sure name and file are uploaded
    setLoading(true);
    if (fileName === "" || userName === "" || password === "") {
      alert("Please fill the required fields.");
      return;
    }

    // check if user is admin
    const check = await isAdmin(userName, password);
    if (!check) {
      alert("Invalid username or password");
      setLoading(false);
      return;
    }
    const success = await deleteApplication(fileName);
    if (!success) {
      alert("Error deleting application");
    } else {
      setSuccess(true);
      setFileName("");
      setUserName("");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <Container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: "10vh",
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: "#39608c",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
          padding: "5vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          sx={{
            marginVertical: "5vh",
            justifyContent: "center",
            alignItems: "flex-start",
            backgroundColor: "white",
            flexDirection: "column",
            padding: "5vh",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            color={"black"}
            fontWeight={800}
          >
            Delete application
          </Typography>
          <TextField
            sx={{ marginTop: "5vh" }}
            label="Username"
            variant="outlined"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setSuccess(false);
            }}
            required
          />
          <FormControl
            sx={{ marginTop: "5vh", marginBottom: "5vh" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSuccess(false);
              }}
            />
          </FormControl>

          <TextField
            label="Application Name"
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />

          <LoadingButton
            sx={{ marginTop: "5vh", marginBottom: "5vh" }}
            variant="contained"
            onClick={handleUpload}
            loading={loading}
          >
            Delete
          </LoadingButton>
          {success ? (
            <Typography
              variant="h5"
              align="center"
              color={"black"}
              fontWeight={800}
            >
              Success!
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ApplicationDelete;
