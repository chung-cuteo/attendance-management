import TableTime from "./_components/TableTime"

type Props = {
  params: { attendanceDate: string }
}

const AttendancePage = ({ params }: Props) => {
  const { attendanceDate } = params
  return (
    <>
      <h1 className="px-4 py-2 rounded bg-gray-200 my-5">ホーム</h1>
      <TableTime date={attendanceDate} />
    </>
  )
}

export default AttendancePage