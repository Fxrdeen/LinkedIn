"use server";

import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { ICommentBase } from "@/mongodb/models/comment";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();
  const commentInput = formData.get("commentInput") as string;
  if (!postId) {
    return new Response("Invalid post ID", { status: 400 });
  }
  if (!commentInput) {
    return new Response("Comment input is required", { status: 400 });
  }
  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  };
  const body: AddCommentRequestBody = {
    user: userDB,
    text: commentInput,
  };
  const post = await Post.findById(postId);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }
  const comment: ICommentBase = {
    user: userDB,
    text: commentInput,
  };
  try {
    await post.commentOnPost(comment);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to create comment");
  }
}
