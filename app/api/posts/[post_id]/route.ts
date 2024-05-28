import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();
  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export interface DeletPostRequestBody {
  userId: string;
}
export async function DELETE(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect();
  await connectDB();
  const { userId }: DeletPostRequestBody = await req.json();
  try {
    const post = await Post.findById(params.post_id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.user.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await post.removePost();
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
