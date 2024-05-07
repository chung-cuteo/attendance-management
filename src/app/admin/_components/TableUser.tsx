"use client"
import { Button, Checkbox, IconButton, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import useSWR from 'swr';
import { getUsers, deleteUser } from '../_api';
import { AttendanceTimeType } from '@/models/AttendanceTime';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { UserType } from '@/models/User';
import UpdateModal from './UpdateModal';
import { formatJapanCurrency } from '@/libs/currencyFormat';

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

const TableUsers = () => {
  const { data, error, isLoading, mutate } = useSWR(`/api/user`, getUsers)
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserType>()

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id)
    mutate()
  }

  const handleUpdateUser = (user: UserType) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedUser({} as UserType)
  }


  return (
    <>
      <UpdateModal isOpen={open} handleClose={handleClose} user={selectedUser} />

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
                    Name
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Admin
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Salary payment type
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Salary
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[40px]"
                  >
                    Edit
                  </th>
                  <th
                    className="p-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[40px]"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((user: UserType, index: number) => (
                  <tr key={user._id}>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {index + 1}.
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {user.name}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {user.email}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      <Checkbox disabled checked={user.admin} />
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {user.salaryPaymentType}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      {user.salaryPaymentType === 'hourly' ? `${formatJapanCurrency(user.salary)}時給` : `${formatJapanCurrency(user.salary)}月給`}
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      <IconButton onClick={() => handleUpdateUser(user)}>
                        <ModeEditOutlineOutlinedIcon />
                      </IconButton>
                    </td>
                    <td className="p-2 border-b border-gray-200 bg-white text-sm text-center">
                      <IconButton aria-label="delete" onClick={() => handleDeleteUser(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default TableUsers