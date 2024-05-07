"use client"

import { forwardRef, useState, ReactElement, Ref, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import FormControl from '@mui/material/FormControl';
import { Checkbox, FormControlLabel, FormLabel, Input, InputAdornment, InputLabel, Radio, RadioGroup } from '@mui/material';
import useSWR from 'swr';
import { getUsers } from '../_api';
import { UserType } from '@/models/User';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

type Props = {
  isOpen: boolean
  user?: UserType
  handleClose: () => void
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Status = "idle" | "loading" | "success" | "error";

export default function UpdateModal({ isOpen, user, handleClose }: Props) {
  const [userAdmin, setUserAdmin] = useState<boolean>(false)
  const [userSalaryPaymentType, setUserSalaryPaymentType] = useState<string>('')
  const [salary, setSalary] = useState<number>()

  const [error, setError] = useState<string>("");
  const [createStatus, setCreateStatus] = useState<Status>("idle");

  const { mutate } = useSWR(`/api/user`, getUsers)

  useEffect(() => {
    if (user) {
      setUserAdmin(user.admin)
      setUserSalaryPaymentType(user.salaryPaymentType)
    }
  }, [user])

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (!salary) {
      setError('給与を入力')
      throw Error("給与を入力")
    }
    try {
      setCreateStatus("loading");
      const res = await fetch("/api/user", {
        method: "PUT",
        body: JSON.stringify({ _id: user?._id, admin: userAdmin, salaryPaymentType: userSalaryPaymentType, salary }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setCreateStatus("success");
        setUserAdmin(false)
        setUserSalaryPaymentType("")
        handleClose()
        mutate()
      } else {
        setCreateStatus("error");
      }

    } catch (error) {
      setError("error")
    }
  }

  return (
    <>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              User
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <form className="flex flex-col gap-6 w-full max-w-[400px] mx-auto mt-8 pb-10 px-5" onSubmit={handleFormSubmit}>
          {error && (
            <p className="text-rose-600 text-center">{error}</p>
          )}

          <div className="flex gap-4">
            <FormControlLabel control={<Checkbox checked={userAdmin || false} onChange={(e) => setUserAdmin(e.target.checked)} />} label="Admin" />
          </div>
          <div className="flex gap-4">
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">SALARY PAYMENT TYPE</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={userSalaryPaymentType || "hourly"}
                onChange={(e) => setUserSalaryPaymentType(e.target.value)}
              >
                <FormControlLabel value="hourly" control={<Radio />} label="hourly" />
                <FormControlLabel value="monthly" control={<Radio />} label="monthly" />
              </RadioGroup>
            </FormControl>
          </div>
          <FormControl variant="standard">
            <InputLabel htmlFor="salary" className="text-lg">支払い手法</InputLabel>
            <Input id="salary"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              }
              value={salary || ''}
              onChange={(e) => {
                setError('')
                setSalary(Number(e.target.value))
              }}
            />
          </FormControl>
          <Button variant="contained" disabled={createStatus === "loading" ? true : false} type="submit" className="mt-6">保存</Button>
        </form>
      </Dialog>
    </>
  );
}
