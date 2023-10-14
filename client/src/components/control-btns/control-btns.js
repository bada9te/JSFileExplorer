import { Add, ArrowBack, ArrowForward, ContentPaste, ContentPasteGo } from "@mui/icons-material";
import { Fab, Stack } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrives, navigateFS, resetSelectedItems, setCurrentPath } from "../items-container/itemsContainerSlice";
import { setIsOpen as setCreateItemModalIsShowing } from "../move-copy-modal/createItemModalSlice";
import { setBackwardAllowed, setForwardAllowed } from "./controlBtnsSlice";
import { copyItem, moveItem } from "../items-container/itemsContainerSlice";
import { setIsShowing, setText } from "../notification/notificationSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchSubTree } from "../directory-tree/directoryTreeSlice";


const ControlBtns = props => {
  const dispatch = useDispatch();
  const history = useSelector(state => state.itemsContainer.history);
  const currentPath = useSelector(state => state.itemsContainer.currentPath);
  const backwardAllowed = useSelector(state => state.controlBtns.backwardAllowed);
  const forwardAllowed = useSelector(state => state.controlBtns.forwardAllowed);
  const selectedItemToCopyPath = useSelector(state => state.itemsContainer.selectedItemToCopyPath);
  const selectedItemToMovePath = useSelector(state => state.itemsContainer.selectedItemToMovePath);


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

  // create
  const handleCreate = () => {
    dispatch(setCreateItemModalIsShowing(true));
  }
  
  // copy (paste)
  const handlePaste = () => {
    dispatch(copyItem({
      source: selectedItemToCopyPath, 
      destination: `${currentPath}\\${selectedItemToCopyPath.slice(selectedItemToCopyPath.lastIndexOf('\\', selectedItemToCopyPath.length))}`,
    }))
      .then(unwrapResult)
      .then(result => {
        if (result.data.done) {
          dispatch(fetchSubTree(currentPath.slice(0, currentPath.length - 1)));
        }
      });
    dispatch(resetSelectedItems());
    dispatch(setText("Item copied"));
    dispatch(setIsShowing(true));
  }

  // move
  const handleMove = () => {
    dispatch(moveItem({
      source: selectedItemToMovePath, 
      destination: `${currentPath}\\${selectedItemToMovePath.slice(selectedItemToMovePath.lastIndexOf('\\', selectedItemToMovePath.length))}`,
    }))
      .then(unwrapResult)
      .then(result => {
        if (result.data.done) {
          dispatch(fetchSubTree(currentPath.slice(0, currentPath.length - 1)));
        }
      });
    dispatch(resetSelectedItems());
    dispatch(setText("Item moved"));
    dispatch(setIsShowing(true));
  }


  useEffect(() => {
    if (history.indexOf(currentPath) > 0) {
      dispatch(setBackwardAllowed(true));
    } else {
      dispatch(setBackwardAllowed(false));
    }

    if (history.indexOf(currentPath) !== history.length - 1 && history.length !== 1) {
      dispatch(setForwardAllowed(true));
    } else {
      dispatch(setForwardAllowed(false));
    }
  }, [currentPath]);

  return (
    <Stack sx={{ position: 'fixed', bottom: 15, right: 15, zIndex: 1, width: '92vw', display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}} direction="row" spacing={1}>
      <Fab color="primary" aria-label="add" onClick={handleGoBackward} disabled={!backwardAllowed}>
        <ArrowBack />
      </Fab>
      <Fab color="primary" aria-label="forward" onClick={handleGoForward} disabled={!forwardAllowed}>
        <ArrowForward />
      </Fab>
      <Fab color="secondary" aria-label="backward" onClick={handleCreate}>
        <Add />
      </Fab>
      { 
        selectedItemToCopyPath
        &&
        <Fab color="error" aria-label="paste" onClick={handlePaste} disabled={currentPath === selectedItemToCopyPath.slice(0, selectedItemToCopyPath.lastIndexOf('\\'))}>
          <ContentPaste />
        </Fab>
      }
      {
        selectedItemToMovePath
        &&
        <Fab color="error" aria-label="move" onClick={handleMove} disabled={currentPath === selectedItemToMovePath.slice(0, selectedItemToMovePath.lastIndexOf('\\'))}>
          <ContentPasteGo />
        </Fab>
      }
      
    </Stack>
  );
}

export default ControlBtns;