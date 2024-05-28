"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;
  if (!postInput) {
    return new Response("Invalid input", { status: 400 });
  }
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };
  try {
    if (image.size > 0) {
      // Write the code to save the image in mongodb database
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: imageUrl,
      };
      await Post.create(body);
    } else {
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error) {
    console.log(error);
  }
}
