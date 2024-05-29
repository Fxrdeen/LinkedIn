import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

async function UserInformation({ posts }: { posts: IPostDocument[] }) {
  const user = await currentUser();
  const userPosts = posts.filter((post) => post.user.userId === user?.id);
  const userComments = posts.flatMap(
    (post) => post?.user.userId === user?.id || []
  );

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
      <Avatar>
        {user?.id ? (
          <AvatarImage src={user?.imageUrl} />
        ) : (
          <AvatarImage src={"https://github.com/shadcn.png"} />
        )}
        <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs">
            @{user?.firstName}
            {user?.lastName}-{user?.id.slice(-4)}
          </p>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="text-center space-y-2">
          <p className="font-semibold">You are not signed In</p>
          <Button asChild className="bg-blue-500 text-white">
            <SignInButton>Sign In</SignInButton>
          </Button>
        </div>
      </SignedOut>
      <hr className="w-full border-t-2 border-gray-300 my-5" />
      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Posts</p>
        <p className="text-blue-400">{userPosts.length}</p>
      </div>
      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Comments</p>
        <p className="text-blue-400">{userComments.length}</p>
      </div>
    </div>
  );
}

export default UserInformation;
