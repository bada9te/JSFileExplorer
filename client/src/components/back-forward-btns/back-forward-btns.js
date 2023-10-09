
import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import { ButtonGroup, Button, Fab, Box, Stack } from "@mui/material";

const BackForwardBtns = props => {
    return (
        <Stack sx={{ position: 'fixed', bottom: 15, right: 15, zIndex: 1, width: '92vw', display: 'flex', justifyContent: {xs: 'center', md: 'flex-end'}}} direction="row" spacing={1}>
        <Fab color="primary" aria-label="add">
            <ArrowBack />
          </Fab>
          <Fab color="primary" aria-label="add">
            <ArrowForward />
          </Fab>
          <Fab color="secondary" aria-label="add">
            <Add />
          </Fab>
        </Stack>
    );
}

export default BackForwardBtns;