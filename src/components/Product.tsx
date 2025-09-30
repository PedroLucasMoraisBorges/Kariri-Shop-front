/* eslint-disable prettier/prettier */
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { addToCart as addToCartApi } from "@/pages/api/add-to-cart";

import Stars from "./Stars";

type Product = {
  id: string;
  name_product: string;
  value: number;
  is_on_discount: boolean;
  description: string;
  value_with_discount: number;
  units?: number;
  stock: number;
  images: [{ id: string; path: string; fk_product: string }];
};

type ProductProps = {
  product: Product;
};

export function ProductCard({ product }: ProductProps) {
  function calculateDivision(divisors: number, value?: number) {
    if (value) {
      return (value / divisors).toFixed(2);
    }
  }

  async function addProductToCart(productId: string) {
    await addToCartApi(productId, 1);
    toast.info("Produto adicionado com Sucesso!");
  }

  function goToProductPage(id: string) {
    window.location.href = `/productPage/${id}`;
  }

  return (
    <div
      className="flex h-[350px] w-60 flex-col justify-between rounded-xl p-3"
      style={{
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="flex flex-col items-center justify-start">
        <img
          src={`http://localhost:3000/${product.images[0].path}`}
          alt=""
          className="h-36 w-36 mb-1"
        />
        <hr className="w-full border-t border-slate-200 my-2" />
      </div>
      <div>
        <Stars product={product} isCard={true} />
      </div>

      <div className="flex flex-col justify-between">
        <p
          className="mb-1 text-xl font-medium text-slate-800"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
          title={product.name_product}
        >
          {product.name_product}
        </p>

        <div className="flex items-end gap-1">
          <p className="flex items-start text-2xl font-medium text-slate-800">
            <span className="text-sm">R$</span>
            {(Number(product?.value) || 0).toFixed(2)}
          </p>
          {product.is_on_discount && (
            <p className="text-slate-600 line-through">
              R${(Number(product?.value_with_discount) || 0).toFixed(2)}
            </p>
          )}
        </div>

        <p className="text-xs">
          Á vista ou em até 10x de{" "}
          <span className="font-medium text-blue-800">
            R$ {calculateDivision(10, product.value)}
          </span>{" "}
          sem juros
        </p>

        <div className="mt-2 flex items-end justify-between gap-1">
          <button
            onClick={() => addProductToCart(product.id)}
            className="rounded-md bg-blue-800 p-2"
          >
            <PlusIcon color="#fff" strokeWidth={2} />
          </button>

          <button
            onClick={() => goToProductPage(product.id)}
            className="w-full rounded-md bg-blue-800 p-2 font-semibold text-white"
          >
            <p>Comprar agora</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
