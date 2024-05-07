import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import UserForm from './_components/UserForm'
import { UserType } from '@/models/User';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserType

  if (!user) return "Not user"

  return (
    <>
      <Link href={'/'} className="flex items-center text-primary"><ArrowBackIcon />勤怠管理へ戻る</Link>
      <h1 className="px-4 py-2 rounded bg-gray-200 my-8">
        プロフィール
      </h1>
      <UserForm />
    </>
  )
}

export default ProfilePage