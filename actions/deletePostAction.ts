"use server";
import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();
  if (!user?.id) {
    return new Error("Unauthorized");
  }
  const post = await Post.findById(postId);
  if (!post) {
    return new Error("Post not found");
  }
  if (post.user.userId !== user.id) {
    return new Error("Unauthorized");
  }
  try {
    await post.removePost();
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    return new Error("Failed to delete post");
  }
}
