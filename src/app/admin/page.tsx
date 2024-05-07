import React from 'react'
import TableUsers from './_components/TableUser'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminPage = () => {
  return (
    <>
      <Link href={'/'} className="flex items-center text-primary mb-6"><ArrowBackIcon />勤怠管理へ戻る</Link>
      <TableUsers />
    </>
  )
}

export default AdminPage