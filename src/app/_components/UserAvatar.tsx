
import Image from "next/image";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const session = useSession()
  const user = session.data?.user

  return (
    <div className="flex items-center gap-2">
      <span> {user?.name}</span>
      <Image priority className="rounded-full" src={user?.image ? user?.image : "/default-avatar.jpg"} alt={user?.name || ""} width={30} height={30} />
    </div>
  )
}

export default UserAvatar