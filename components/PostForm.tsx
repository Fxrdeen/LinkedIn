"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const [preview, setPreview] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();
    const text = formDataCopy.get("postInput") as string;
    if (!text.trim()) {
      throw new Error("Post cannot be empty");
    }
    setPreview(null);
    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData: FormData) => {
          handlePostAction(formData);
        }}
        className="p-3 bg-white rounded-lg border"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <input
            type="text"
            name="postInput"
            placeholder="Start a post.."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <button type="submit" hidden>
            Post
          </button>
        </div>
        {preview && (
          <div className="mt-3">
            <img src={preview} className="w-full object-cover" />
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Edit" : "Upload"}
          </Button>
          {preview && (
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setPreview(null)}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove
            </Button>
          )}
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
}

export default PostForm;
