import {
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  NativeSelect,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { isAdmin, uploadApplication } from "../utils/AtlasAPI";
import { MuiFileInput } from "mui-file-input";
import { extractMessageItems } from "../utils/LoadApplication";
import { MessageItem } from "../utils/types";
import { LoadingButton } from "@mui/lab";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ApplicationUpload = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState<File | null>(null);
  const [imageData, setImageData] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [applicationType, setApplicationType] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (newFile: File | null) => {
    // check if newfile is .xlsx
    // if not, set error
    if (newFile === null) {
      setData(newFile);
      return;
    }
    if (newFile.name.split(".")[1] !== "xlsx") {
      alert("Please upload a .xlsx file");
      return;
    }
    setData(newFile);
  };

  const handleImageChange = (newFile: File | null) => {
    // check if newfile is an image file
    // if not, set error
    if (newFile === null) {
      setImageData(newFile);
      return;
    }

    if (
      newFile.name.split(".")[1] !== "png" &&
      newFile.name.split(".")[1] !== "jpg" &&
      newFile.name.split(".")[1] !== "jpeg" &&
      newFile.name.split(".")[1] !== "PNG" &&
      newFile.name.split(".")[1] !== "JPG" &&
      newFile.name.split(".")[1] !== "JPEG"
    ) {
      alert("Please upload a .png, .jpg, or .jpeg file");
      return;
    }
    setImageData(newFile);
  };

  const handleUpload = async () => {
    // make sure name and file are uploaded
    setLoading(true);
    if (
      fileName === "" ||
      data === null ||
      imageData === null ||
      userName === "" ||
      password === "" ||
      (applicationType !== 0 && applicationType !== 1)
    ) {
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

    const items: MessageItem[] = extractMessageItems(data!);
    if (items === null || items === undefined) {
      alert("Invalid file");
    } else {
      const success = await uploadApplication(
        fileName,
        applicationType,
        items,
        imageData
      );
      if (!success) {
        alert("Error uploading application");
      } else {
        setFileName("");
        setData(null);
        setImageData(null);
        setUserName("");
        setPassword("");
        setSuccess(true);
        setApplicationType(0);
      }
      setLoading(false);
    }
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
            Upload your application here
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

          <TextField
            label="Application Name"
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
          <FormControl sx={{ marginTop: "4vh", width: "15vw" }}>
            <InputLabel id="demo-simple-select-label">
              Application Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={applicationType}
              label="Application Type"
              onChange={(e) =>
                setApplicationType(parseInt(e.target.value as string))
              }
            >
              <MenuItem value={0}>Substance Use</MenuItem>
              <MenuItem value={1}>General</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant="body1"
            color={"black"}
            fontWeight={800}
            sx={{ marginTop: "5vh" }}
          >
            Upload a the application as an .xslx file
          </Typography>
          <MuiFileInput
            value={data}
            onChange={handleChange}
            required
            placeholder="Upload a .xlsx file *"
            sx={{ marginTop: "2.5vh", marginBottom: "5vh" }}
          />
          <Typography
            variant="body1"
            color={"black"}
            fontWeight={800}
            sx={{ marginTop: "5vh" }}
          >
            Upload a the image as an .png, .jpg or .jpeg file
          </Typography>
          <MuiFileInput
            value={imageData}
            onChange={handleImageChange}
            required
            placeholder="Upload an image file *"
            sx={{ marginTop: "2.5vh", marginBottom: "5vh" }}
          />
          <LoadingButton
            sx={{ marginTop: "5vh", marginBottom: "5vh" }}
            variant="contained"
            onClick={handleUpload}
            loading={loading}
          >
            Upload
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

export default ApplicationUpload;
