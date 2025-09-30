/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ProductsCart from "@/components/ProductsCart";
import SaleInfo from "@/components/SaleInfo";
import {
  addToCart,
  addUnitToCart,
  removeUnitFromCart,
} from "@/pages/api/add-to-cart";
import {
  getShoppingCartProducts,
  getSimilarProducts,
} from "@/pages/api/get-shopping-cart-products";

type Product = {
  id: string;
  productCartId? : string;
  name_product: string;
  value: number;
  is_on_discount: boolean;
  value_with_discount: number;
  units?: number;
  images: [{ id: string; path: string; fk_product: string }];
};

export function ShoppingCart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [cartId, setCartId] = useState("");

  async function fetchProducts() {
    const response = await getShoppingCartProducts();

    if (response) {
      setProducts(response.products);
      setCartId(response.cart.id);
    }
  }

  async function fetchSimilarProducts(defaultProducts: Product[]) {
    const response = await getSimilarProducts(defaultProducts);
    if (response) {
      setSimilarProducts(response);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      fetchSimilarProducts(products);
    }
  }, [products]);

  async function addProductToCart(productId: string) {
    await addToCart(productId, 1);
    toast.info("Produto adicionado com Sucesso!");

    fetchProducts();
  }

  async function addUnitProductToCart(productId: string) {
    await addUnitToCart(productId);
    toast.info("Produto adicionado com Sucesso!");

    fetchProducts();
  }

  async function removeProductUnit(productCartId: string) {
    await removeUnitFromCart(productCartId);
    toast.info("Unidade removida com Sucesso!");

    fetchProducts();
  }

  async function handleBuyShoppingCart() {
    navigate(`/addressConfirmation/cart/${cartId}`);
  }

  function getProductPrice(product: Product) {
    if (!product.is_on_discount) {
      return <span>R$ {product.value}</span>;
    } else {
      return (
        <span>
          <span className="line-through">R$ {product.value} </span>{" "}
          <span className="ml-3 font-bold text-blue-800">
            R$ {product.value}
          </span>
        </span>
      );
    }
  }

  return (
    <>
      <Helmet title="Carrinho" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Carrinho</h1>

          <div className="flex flex-col gap-6 px-3 lg:flex-row">
            <ProductsCart
              products={products}
              onAddToCart={addUnitProductToCart}
              onRemoveFromCart={removeProductUnit}
            />
            <div className="flex w-full flex-col gap-8 border-black lg:w-1/3 lg:border-l lg:pl-10">
              <div
                className="grid grid-rows-3"
                style={{ gridTemplateRows: "auto 45px" }}
              >
                <SaleInfo productsCart={products} />
                <button
                  onClick={() => handleBuyShoppingCart()}
                  className="flex w-full items-center justify-center rounded-lg bg-orange_button p-3 text-xl font-semibold text-white"
                >
                  Comprar
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {similarProducts.length !== 0 && (
                  <h2 className="text-xl">Adicionar produtos no carrinho</h2>
                )}

                <div className="flex flex-col gap-2">
                  {similarProducts.map((product) => (
                    <div key={product.id} className="flex">
                      <img
                        src={`http://localhost:3000/${product.images[0].path}`}
                        alt="productImage"
                        className="h-24 w-24 rounded-lg border-slate-200 sm:w-28"
                      />

                      <div className="flex flex-col justify-between gap-2 pl-3">
                        <div>
                          <p className="font-normal">{product.name_product}</p>
                          <p className="font-normal text-orange_text">
                            {getProductPrice(product)}
                          </p>
                        </div>
                        <button
                          onClick={() => addProductToCart(product.id)}
                          className="max-w-fit rounded-full bg-blue-800 p-1 pl-4 pr-4 font-semibold text-white"
                        >
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;
