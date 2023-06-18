import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmUser, uploadApplication } from "../utils/AtlasAPI";
import { MuiFileInput } from "mui-file-input";
import { extractMessageItems } from "../utils/LoadApplication";
import { MessageItem } from "../utils/types";
import { LoadingButton } from "@mui/lab";

const ApplicationUpload = () => {
  const [data, setData] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (newFile: File | null) => {
    // check if newfile is .xlsx
    // if not, set error
    if (newFile === null) return;
    if (newFile.name.split(".")[1] !== "xlsx") {
      alert("Please upload a .xlsx file");
      return;
    }
    setData(newFile);
  };

  const handleUpload = async () => {
    // make sure name and file are uploaded
    setLoading(true);
    if (fileName === "" || data === null) {
      alert("Please upload a file and name it");
      return;
    }
    const items: MessageItem[] = extractMessageItems(data!);
    if (items === null || items === undefined) {
      alert("Invalid file");
    } else {
      // upload to database
      // upload to database
      // if successful, redirect to /dashboard
      // if not, alert error
      const success = await uploadApplication(fileName, items);
      if (!success) {
        alert("Error uploading application");
      }
      setLoading(false);
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
          flexDirection: "column",
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
            marginTop: "5%",
            marginHorizontal: "10%",
            justifyContent: "center",
            alignItems: "flex-start",
            backgroundColor: "white",
            width: "30%",
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
            Upload your application here
          </Typography>

          <TextField
            sx={{ marginTop: "5%", marginBottom: "5%" }}
            label="Application Name"
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
          <MuiFileInput
            value={data}
            onChange={handleChange}
            required
            getInputText={(file: File | null) => {
              if (file === null) return "Upload .xlsx file";
              return file.name;
            }}
          />
          <LoadingButton
            sx={{ marginTop: "5%" }}
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
    </Grid>
  );
};

export default ApplicationUpload;
