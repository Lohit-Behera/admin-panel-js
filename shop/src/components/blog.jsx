import Link from "next/link";

function Blog({ blog }) {
  return (
    <div className="grid gap-1 p-4 border rounded-md">
      <Link href={`/blog/${blog._id}`}>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-32 rounded-md object-cover"
        />
      </Link>
      <Link
        href={`/blog/${blog._id}`}
        className="text-sm md:text-base font-semibold line-clamp-2 hover:underline underline-offset-2"
      >
        {blog.title}
      </Link>
    </div>
  );
}

export default Blog;
