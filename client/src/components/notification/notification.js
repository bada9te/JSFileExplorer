import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowing } from './notificationSlice';

export default function SimpleSnackbar(props) {
  const dispatch = useDispatch();
  const text = useSelector(state => state.notification.text);
  const isShowing = useSelector(state => state.notification.isShowing);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(setIsShowing(false));
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        OK
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={isShowing}
        autoHideDuration={2000}
        onClose={handleClose}
        message={text}
        action={action}
      />
    </div>
  );
}
