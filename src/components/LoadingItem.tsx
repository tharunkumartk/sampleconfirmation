import { Box, CircularProgress } from "@mui/material";

const LoadingItem = () => {
  return (
    <Box
      style={{ width: "50%", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress sx={{ color: "white" }} size={20} thickness={5} />
    </Box>
  );
};
export default LoadingItem;
