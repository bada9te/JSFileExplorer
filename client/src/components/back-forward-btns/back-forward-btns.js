
import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Fab, Stack } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrives, navigateFS, setCurrentPath } from "../items-container/itemsContainerSlice";

const BackForwardBtns = props => {
  const dispatch = useDispatch();
  const history = useSelector(state => state.itemsContainer.history);
  const currentPath = useSelector(state => state.itemsContainer.currentPath);


  // move fs history backward
  const handleGoBackward = () => {
    // go back
    let newPoint = history.indexOf(currentPath) - 1;
    // if home dir
    if (history[newPoint] === "Home") {
      dispatch(fetchDrives());
      dispatch(setCurrentPath(""));
    }
    // if not 
    else {
      dispatch(navigateFS(history[newPoint]));
      let newPath = currentPath.slice(0, currentPath.length - 1);
      newPath = newPath.slice(0, newPath.lastIndexOf('\\') + 1);
      dispatch(setCurrentPath(newPath));
    }

  }

  // move fs history forward
  const handleGoForward = () => {
    let fixPoint = currentPath === "" ? 1 : 0;
    let newPoint = history.indexOf(currentPath) + 1 + fixPoint;
    dispatch(navigateFS(history[newPoint]));
    dispatch(setCurrentPath(history[newPoint]));
  }

  return (
    <Stack sx={{ position: 'fixed', bottom: 15, right: 15, zIndex: 1, width: '92vw', display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}} direction="row" spacing={1}>
      <Fab color="primary" aria-label="add" onClick={handleGoBackward}>
        <ArrowBack />
      </Fab>
      <Fab color="primary" aria-label="add" onClick={handleGoForward}>
        <ArrowForward />
      </Fab>
      <Fab color="secondary" aria-label="add">
        <Add />
      </Fab>
    </Stack>
  );
}

export default BackForwardBtns;