"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }

      setError("email", { message: "Something went wrong." });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-white"
      >
        Add friend to chat by E-Mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
          placeholder="rajeshsingh@gmail.com"
        />
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          Add
        </Button>
      </div>
      <p className="mt-2 text-xl text-white">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
