"use client"
import { Button, IconButton, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import useSWR from 'swr';
import { deleteAttendances, getAttendances } from '../_api';
import { AttendanceTimeType } from '@/models/AttendanceTime';
import { format } from 'date-fns';
import { da, ja } from 'date-fns/locale';
import CreateUpdateModal from './CreateUpdateModal';
import { useMemo, useState } from 'react';
import { displayHoursMinusFromMinutes } from '@/libs/datetime';
import YearMonthList from './YearMonthList';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { formatJapanCurrency } from '@/libs/currencyFormat';
import { fetchUserInfo } from '@/app/hooks/fetchUserInfo';

type Props = {
  date: string
}

const LoadingComponent = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) return (
    <p>Loading...</p>
  )
}

const ErrorComponent = ({ error }: { error: Error }) => {
  if (error) return (
    <p>Something wrong</p>
  )
}
const NotDataComponent = ({ isNotData }: { isNotData: boolean }) => {
  if (isNotData) return (
    <p>Not data</p>
  )
}

const TableTime = ({ date }: Props) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/attendance?date=${date}`, getAttendances)
  const { data: userInfo } = useSWR(`/api/user-info`, fetchUserInfo)
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceTimeType>()

  const handleDeleteAttendance = async (id: string) => {
    await deleteAttendances(id)
    mutate()
  }

  const handleUpdateAttendance = (item: AttendanceTimeType) => {
    const customData = {
      _id: item._id,
      workStartTime: item.workStartTime,
      workEndTime: item.workEndTime,
      restStartTime: item.restStartTime,
      restEndTime: item.restEndTime,
      fromStation: item.fromStation,
      toStation: item.toStation,
      transportationFee: item.transportationFee,
    }
    setSelectedAttendance(customData as AttendanceTimeType)
    setOpen(true)
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedAttendance({} as AttendanceTimeType)
  }

  const calculationWorkingDays = useMemo(() => {
    let sum = 0
    if (data?.length > 0) {
      sum = data.reduce((acc: number, currentValue: AttendanceTimeType) => {
        return acc + currentValue.sumWorkingMinutes
      }, 0)
    }

    return displayHoursMinusFromMinutes(sum)

  }, [data])

  const calculationTransportationFee = useMemo(() => {
    let sum = 0
    if (data?.length > 0) {
      sum = data.reduce((acc: number, currentValue: AttendanceTimeType) => {
        return acc + Number(currentValue.transportationFee)
      }, 0)
    }

    return sum

  }, [data])


  return (
    <>
      <CreateUpdateModal date={date} isOpen={open} handleClose={handleClose} attendance={selectedAttendance} />
      <div className="flex justify-between">
        <YearMonthList date={date} />
        <Button variant="outlined" className="flex items-center gap-1 mb-6 font-bold" onClick={handleOpen}>
          <AddOutlinedIcon />タイムカード作成
        </Button>
      </div>

      <LoadingComponent isLoading={isLoading} />
      <NotDataComponent isNotData={data?.length <= 0} />
      <ErrorComponent error={error} />
      {data?.length > 0 && (
        <>
          <div className="shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-[700px] leading-normal">
              <thead>
                <tr>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[40px]"
                  >
                    No.
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    出勤日
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    開始
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    終了
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    休憩時間
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    業務時間
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    通勤区間
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    交通費
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[40px]"
                  >
                    編集
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[40px]"
                  >
                    削除
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: AttendanceTimeType, index: number) => (
                  <tr key={item._id}>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {index + 1}.
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {format(item.workingDay, 'M/d (eee)', { locale: ja })}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {item.workStartTime}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {item.workEndTime}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {item.sumRestingMinutes == 0 ? '-' : displayHoursMinusFromMinutes(item.sumRestingMinutes)}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {displayHoursMinusFromMinutes(item.sumWorkingMinutes)}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {item.fromStation && item.toStation ? `${item.fromStation} ~ ${item.toStation}` : '-'}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {item.transportationFee ? formatJapanCurrency(Number(item.transportationFee)) + '円' : "-"}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      <IconButton onClick={() => handleUpdateAttendance(item)}>
                        <ModeEditOutlineOutlinedIcon />
                      </IconButton>
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      <IconButton aria-label="delete" onClick={() => handleDeleteAttendance(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 mt-12 max-w-[300px]">
            <div className="flex items-center">
              <span className="min-w-[120px]">勤務日数:</span>
              <span>{data?.length}日</span>
            </div>
            <div className="flex items-center">
              <span className="min-w-[120px]">合計時間:</span>
              <span>{calculationWorkingDays}</span>
            </div>
            <div className="flex items-center">
              <span className="min-w-[120px]">合計交通費:</span>
              <span>{formatJapanCurrency(calculationTransportationFee)}円</span>
            </div>
            <div className="flex items-center">
              <span className="min-w-[120px]">支払い手法:</span>
              <span>{userInfo.salaryPaymentType === 'hourly' ? `${formatJapanCurrency(userInfo.salary)}時給` : `${formatJapanCurrency(userInfo.salary)}月給`}</span>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TableTime