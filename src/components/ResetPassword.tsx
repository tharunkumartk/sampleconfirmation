import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/AtlasAPI";
import { LoadingButton } from "@mui/lab";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [params] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleUpload = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // password must be 8 characters
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const success = await resetPassword(
      params.get("token")!,
      params.get("tokenId")!,
      password
    );
    if (!success) {
      alert("Error resetting password");
      setLoading(false);
    } else {
      setLoading(false);
      setSuccess(true);
    }
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: "#39608c",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
          width: "90%",
          height: "90%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          color={"white"}
          fontWeight={800}
        >
          RescaleMed
        </Typography>
        <Grid
          container
          sx={{
            width: "90%",
            marginHorizontal: "20%",
            justifyContent: "center",
            alignItems: "flex-start",
            backgroundColor: "white",
            flexDirection: "column",
            padding: "5%",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            color={"black"}
            fontWeight={800}
          >
            Reset Password
          </Typography>
          <FormControl
            sx={{ marginTop: "5%", marginBottom: "5%" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              New Password
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl
            sx={{ marginTop: "5%", marginBottom: "5%" }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword2 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword2(!showPassword2)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <LoadingButton
            sx={{ marginTop: "5%" }}
            variant="contained"
            onClick={handleUpload}
            loading={loading}
          >
            Submit
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
    </Grid>
  );
};

export default ResetPassword;
