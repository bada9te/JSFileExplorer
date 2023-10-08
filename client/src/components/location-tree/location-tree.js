/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Folder } from '@mui/icons-material';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function LocationTree() {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs maxItems={2} aria-label="breadcrumb" sx={{color: 'white'}}>
        <Link underline="hover" color="inherit" href="#" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Folder sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Folder sx={{ mr: 0.5 }} />
          Folder 1
        </Link>
        <Link underline="hover" color="inherit" href="#" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Folder sx={{ mr: 0.5 }} />
          Folder 2
        </Link>
        <Typography>Destination</Typography>
      </Breadcrumbs>
    </div>
  );
}
