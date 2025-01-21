import { Button } from "./ui/button";
import Link from "next/link";

function Product({ product }) {
  return (
    <div className="grid gap-1 p-4 border rounded-md">
      <Link href={`/product/${product._id}`}>
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-32 rounded-md object-cover"
        />
      </Link>
      <Link
        href={`/product/${product._id}`}
        className="text-sm md:text-base font-semibold line-clamp-1 hover:underline underline-offset-2"
      >
        {product.name}
      </Link>
      <p className="text-sm text-muted-foreground">
        Price: ₹{product.sellingPrice}
      </p>
      <Button
        size="sm"
        onClick={() => window.open(product.affiliateLink, "_blank")}
      >
        Buy now
      </Button>
    </div>
  );
}

export default Product;
