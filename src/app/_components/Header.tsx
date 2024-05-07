import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import UserMenu from "./UserMenu";
import Link from "next/link";

const Header = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user

  return (
    <div className="flex items-center py-4 fixed top-0 right-0 left-0 px-6 bg-white z-[10]">
      <p className="pr-2 font-bold text-xl">勤怠管理</p>
      <div className="flex items-center gap-5 ml-auto">
        {await isAdmin() && (
          <Link href={"/admin"}>ADMIN</Link>
        )}
        {user && <UserMenu />}
      </div>
    </div>
  )
}

export default Header