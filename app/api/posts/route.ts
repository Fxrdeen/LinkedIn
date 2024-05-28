import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}

export async function POST(req: Request) {
  auth().protect();
  try {
    await connectDB();
    const { user, text, imageUrl }: AddPostRequestBody = await req.json();
    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }),
    };
    const post = await Post.create(postData);
    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();
    return NextResponse.json({ posts });
    return;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
}
