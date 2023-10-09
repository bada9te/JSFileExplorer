import './App.css';
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid, InputBase, Stack } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Bookmark, Delete, Folder, Home, Route, SearchRounded } from '@mui/icons-material';
import ItemsContainer from './components/items-container/items-container';
import folderImage from "./images/folder.png";
import LeftBarLink from './components/left-bar-link/left-bar-link';
import BackForwardBtns from './components/back-forward-btns/back-forward-btns';
import { useSelector } from 'react-redux';



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  //width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

const drawerWidth = 240;




function App(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const currentPath = useSelector(state => state.itemsContainer.currentPath);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <AppBar sx={{position: 'relative', m: 0, p: 0}}>
        <Toolbar sx={{ px: 1 }}>
          <Stack spacing={1} flexWrap={false} flex={true} direction="row" alignItems={'center'}>
            
            <img src={folderImage} alt="logo" style={{objectFit: 'contain', width: '30px'}}/>
            <Typography variant="h6" noWrap component="div">
              File Explorer
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <Divider />
      <List>
        <LeftBarLink text="Home" icon={<Home/>} />
        <LeftBarLink text="Bookmarks" icon={<Bookmark/>} />
        <LeftBarLink text="Trash" icon={<Delete/>} />
      </List>
      <Divider />

      <List>
        <LeftBarLink text="RECENT_FOLDER" icon={<Folder/>} />
        <LeftBarLink text="RECENT_FOLDER" icon={<Folder/>} />
        <LeftBarLink text="RECENT_FOLDER" icon={<Folder/>} />
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BackForwardBtns/>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
            <Grid container component="main" spacing={2}>
              <Grid item xs={6} sm={7} md={9}>
                <Search>
                  <SearchIconWrapper>
                    <Route/>
                  </SearchIconWrapper>
                  <StyledInputBase
                    inputProps={{ 'aria-label': 'path' }}
                    value={currentPath}
                  />
                </Search>
              </Grid>

              <Grid item xs={6} sm={5} md={3}>
                <Search>
                  <SearchIconWrapper>
                    <SearchRounded />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Grid>
            </Grid>
            
            
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <ItemsContainer/>
      </Box>
    </Box>
  );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};


export default App;
