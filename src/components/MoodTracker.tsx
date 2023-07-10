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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { MoodEntry } from "../utils/types";
import { getMood, getUserId, isAdmin } from "../utils/AtlasAPI";
import { ObjectId } from "bson";
import { LoadingButton } from "@mui/lab";
import WeeklyMood from "./WeeklyMood";

const MoodTracker = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [error, setError] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  const fetchMoods = async (userId: ObjectId) => {
    try {
      const updMoods = await getMood(userId);
      setMoods(updMoods);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    if ((await isAdmin(userName, password)) === false) {
      setError("Invalid username or password");
      setSuccess(false);
      setLoading(false);
      return;
    }

    // find userId belonging to the given email
    const userId = await getUserId(firstName, lastName);
    if (userId === false) {
      setError("User not found");
      setSuccess(false);
      setLoading(false);
      return;
    }

    console.log(userId);

    // fetch the given moods
    await fetchMoods(userId);

    setSuccess(true);
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
            Rescalemed Data Query
          </Typography>
          <TextField
            sx={{ marginTop: "5vh" }}
            label="Username"
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Typography
            variant="body1"
            color={"black"}
            fontWeight={800}
            sx={{ marginTop: "5vh" }}
          >
            Query parameters
          </Typography>
          <TextField
            sx={{ marginTop: "5vh" }}
            label="First Name "
            variant="outlined"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setError("");
            }}
            required
          />
          <TextField
            sx={{ marginTop: "5vh" }}
            label="Last Name "
            variant="outlined"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setError("");
            }}
            required
          />
          <Typography
            variant="body1"
            color={"red"}
            fontWeight={800}
            sx={{ marginTop: "5vh" }}
          >
            {error}
          </Typography>

          <LoadingButton
            sx={{ marginTop: "5vh", marginBottom: "5vh" }}
            variant="contained"
            onClick={onSubmit}
            loading={loading}
          >
            Search
          </LoadingButton>
          {success && !loading && error === "" ? (
            <WeeklyMood moods={moods} />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MoodTracker;
