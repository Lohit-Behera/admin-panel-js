function Blog({ blog }) {
  return (
    <div className="grid gap-1 p-4 border rounded-md">
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-32 rounded-md object-cover"
      />
      <h4 className="text-sm md:text-base font-semibold line-clamp-2">
        {blog.title}
      </h4>
    </div>
  );
}

export default Blog;
