import AddFriendButton from "@/app/components/AddFriendButton";
import { FC } from "react";

const page: FC = ({}) => {
  return (
    <main className="pt-8 bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-5xl mb-8 text-white">Add a friend</h1>
        <AddFriendButton />
      </div>
    </main>
  );
};

export default page;
