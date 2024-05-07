"use client"
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { FormControl } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { AccountCircle } from '@mui/icons-material';
import Image from "next/image";
import useSWR from 'swr';
import { fetchUserInfo } from '@/app/hooks/fetchUserInfo';
import PaidIcon from '@mui/icons-material/Paid';
import { formatJapanCurrency } from '@/libs/currencyFormat';

const UserForm = () => {
  const { data: user } = useSWR(`/api/user-info`, fetchUserInfo)

  return (
    <>
      <form className="flex flex-col gap-4 items-center m-auto max-w-[400px]">
        <div>
          <Image className="rounded-full" priority src={user?.image ? user?.image : "/default-avatar.jpg"} alt={user?.name || ""} width={70} height={70} />
        </div>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            value={user?.name}
            disabled
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            disabled
            value={user?.email}
            startAdornment={
              <InputAdornment position="start">
                <EmailOutlinedIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="salaryPaymentType">Salary Payment Type</InputLabel>
          <Input
            id="salaryPaymentType"
            disabled
            value={user?.salaryPaymentType}
            startAdornment={
              <InputAdornment position="start">
                <PaidIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="salary">Salary</InputLabel>
          <Input
            id="salary"
            disabled
            value={user.salaryPaymentType === 'hourly' ? `${formatJapanCurrency(user.salary)}時給` : `${formatJapanCurrency(user.salary)}月給`}
            startAdornment={
              <InputAdornment position="start">
                <PaidIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      </form>
    </>
  );
}

export default UserForm