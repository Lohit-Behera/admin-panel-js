import { Button } from "./ui/button";

function Product({ product }) {
  return (
    <div className="grid gap-1 p-4 border rounded-md">
      <img
        src={product.thumbnail}
        alt={product.name}
        className="w-full h-32 rounded-md object-cover"
      />
      <h4 className="text-sm md:text-base font-semibold line-clamp-1">
        {product.name}
      </h4>
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
