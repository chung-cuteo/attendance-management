"use client"

import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserAvatar from "@/app/_components/UserAvatar";
import { signOut } from "next-auth/react";
import { Avatar } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const UserMenu = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGotoProfile = () => {
    setAnchorEl(null);
    router.push('/profile')
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        id="basic-button"
        className="text-black lowercase text-lg"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <UserAvatar />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 28,
              height: 28,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleGotoProfile}>
          <Avatar />Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} className="gap-3 mt-2"><Logout />Logout</MenuItem>
      </Menu>
    </div>
  );
}


export default UserMenu