"use client"
import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useSWR from 'swr';
import { getYearMonthAttendances } from '../_api';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';

type Props = {
  date: string
}
const YearMonthList = ({ date }: Props) => {
  const router = useRouter()
  const { data: listYearMonth, isLoading } = useSWR(`/api/attendance-year-month`, getYearMonthAttendances)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePushRouter = (item: string) => {
    router.push(item)
    setAnchorEl(null);
  }

  if (isLoading) return <Skeleton variant="rounded" width={70} height={40} />

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
      >
        {date}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {listYearMonth.length <= 0 && (
          <MenuItem>Not items</MenuItem>
        )}
        {listYearMonth.length > 0 && listYearMonth?.map((item: string) => (
          <MenuItem key={item} onClick={() => handlePushRouter(item)}>{item}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default YearMonthList