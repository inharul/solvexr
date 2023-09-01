import React from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { Box } from "@mui/joy";

const Loading = () => {
  return (
    <Box marginTop={5} paddingX={5}>
      <CircularProgress variant="soft" />
    </Box>
  );
};

export default Loading;
