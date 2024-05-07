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
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { InputAdornment } from '@mui/material';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import PlaceIcon from '@mui/icons-material/Place';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useSWR from 'swr';
import { getAttendances } from '../_api';
import { AttendanceTimeType } from '@/models/AttendanceTime';

type Props = {
  date: string
  isOpen: boolean
  attendance?: AttendanceTimeType
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

export default function CreateUpdateModal({ date, isOpen, handleClose, attendance }: Props) {
  const [workStartTime, setWorkStartTime] = useState<string>('')
  const [workEndTime, setWorkEndTime] = useState<string>('')
  const [restStartTime, setRestStartTime] = useState<string>('')
  const [restEndTime, setRestEndTime] = useState<string>('')
  const [fromStation, setFromStation] = useState<string>('')
  const [toStation, setToStation] = useState<string>('')
  const [transportationFee, setTransportationFee] = useState<string>('')

  const [error, setError] = useState<string>("");
  const [createStatus, setCreateStatus] = useState<Status>("idle");

  const { mutate } = useSWR(`/api/attendance?date=${date}`, getAttendances)

  useEffect(() => {
    if (attendance) {
      setWorkStartTime(attendance.workStartTime)
      setWorkEndTime(attendance?.workEndTime)
      setRestStartTime(attendance?.restStartTime)
      setRestEndTime(attendance?.restEndTime)
      setFromStation(attendance?.fromStation)
      setToStation(attendance?.toStation)
      setTransportationFee(attendance?.transportationFee)
    }
  }, [attendance])

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    if (!workStartTime || !workEndTime) {
      setError('開始時間と終了時間を入力する必要')
      throw Error('開始時間と終了時間を入力する必要')
    }
    try {
      setCreateStatus("loading");
      const res = await fetch("/api/attendance", {
        method: attendance && Object.keys(attendance).length ? "PUT" : "POST",
        body: JSON.stringify({ _id: attendance?._id, workStartTime, workEndTime, restStartTime, restEndTime, fromStation, toStation, transportationFee }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setCreateStatus("success");
        setWorkStartTime("");
        setWorkEndTime("");
        setRestStartTime("")
        setRestEndTime("")
        setFromStation("")
        setToStation("")
        setTransportationFee("")
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
              タイムカード
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
            <FormControl variant="standard">
              <InputLabel htmlFor="workStartTime" className="text-lg">開始時間</InputLabel>
              <Input id="workStartTime"
                startAdornment={
                  <InputAdornment position="start">
                    <AlarmOnIcon />
                  </InputAdornment>
                }
                value={workStartTime || ''}
                onChange={(e) => {
                  setError('')
                  setWorkStartTime(e.target.value)
                }}
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="workEndTime" className="text-lg">終了時間</InputLabel>
              <Input id="workEndTime"
                startAdornment={
                  <InputAdornment position="start">
                    <AlarmOnIcon />
                  </InputAdornment>
                }
                value={workEndTime || ''}
                onChange={(e) => {
                  setError('')
                  setWorkEndTime(e.target.value)
                }
                } />
            </FormControl>
          </div>
          <div className="flex gap-4">
            <FormControl variant="standard">
              <InputLabel htmlFor="restStartTime" className="text-lg">休憩開始時間</InputLabel>
              <Input id="restStartTime"
                startAdornment={
                  <InputAdornment position="start">
                    <AlarmOnIcon />
                  </InputAdornment>
                }
                value={restStartTime || ''}
                onChange={(e) => {
                  setError('')
                  setRestStartTime(e.target.value)
                }}
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="restEndTime" className="text-lg">休憩終了時間</InputLabel>
              <Input id="restEndTime"
                startAdornment={
                  <InputAdornment position="start">
                    <AlarmOnIcon />
                  </InputAdornment>
                }
                value={restEndTime || ''}
                onChange={(e) => {
                  setError('')
                  setRestEndTime(e.target.value)
                }}
              />
            </FormControl>
          </div>
          <div className="flex gap-4">
            <FormControl variant="standard">
              <InputLabel htmlFor="fromStation" className="text-lg">入場駅</InputLabel>
              <Input id="fromStation"
                startAdornment={
                  <InputAdornment position="start">
                    <PlaceIcon />
                  </InputAdornment>
                }
                value={fromStation || ''}
                onChange={(e) => {
                  setError('')
                  setFromStation(e.target.value)
                }}
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="toStation" className="text-lg">出場駅</InputLabel>
              <Input id="toStation"
                startAdornment={
                  <InputAdornment position="start">
                    <PlaceIcon />
                  </InputAdornment>
                }
                value={toStation || ''}
                onChange={(e) => {
                  setError('')
                  setToStation(e.target.value)
                }}
              />
            </FormControl>
          </div>
          <FormControl variant="standard" className="w-1/2">
            <InputLabel htmlFor="transportationFee" className="text-lg">交通費</InputLabel>
            <Input id="transportationFee"
              startAdornment={
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              }
              value={transportationFee || ''}
              onChange={(e) => {
                setError('')
                setTransportationFee(e.target.value)
              }}
            />
          </FormControl>

          <Button variant="contained" disabled={createStatus === "loading" ? true : false} type="submit" className="mt-6">保存</Button>
        </form>
      </Dialog>
    </>
  );
}
