/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import SaleInfo from "@/components/SaleInfo";
import { getPrincipalAddress } from "@/pages/api/address-module";
import { getProductInfo } from "@/pages/api/get-all-products";
import { getCustomUserInfo } from "@/pages/api/get-profile";
import { getProductsFromSpecificShoppingCart } from "@/pages/api/get-shopping-cart-products";
import { createStripeSession, createStripeSessionCart } from "@/pages/api/stripe-integration";

type Address = {
  id: string;
  cep: string;
  city: string;
  complement: string;
  neighborhood: string;
  number: number;
  road: string;
  state: string;
};

type Product = {
  id: string;
  name_product: string;
  value: number;
  is_on_discount: boolean;
  value_with_discount: number;
  units: number;
  images: [{ id: string; path: string; fk_product: string }];
};

type CustomUser = {
  cpf: string;
  name: string;
  birthday: Date;
  email: string;
  accept_delivery: boolean;
};

export function OrderSummary() {
  const [address, setAddress] = useState<Address>();
  const [product, setProduct] = useState<Product>();
  const [productsCart, setProductsCart] = useState<Product[]>([]);
  const [customUser, setCustomUser] = useState<CustomUser>();

  async function fetchThePrincipalAddress() {
    const address = await getPrincipalAddress();

    setAddress(address);
  }

  async function fetchProductsCart(currentCartId: string) {
    const response = await getProductsFromSpecificShoppingCart(currentCartId);

    if (response) {
      setProductsCart(response.products);
    }
  }

  async function fetchProductInfo(currentProdId: string) {
    const response = await getProductInfo(currentProdId);

    if (response) {
      setProduct(response);
    }
  }

  const { routeProdId, routeCartId } = useParams<{
    routeProdId?: string;
    routeCartId?: string;
  }>();

  useEffect(() => {
    fetchThePrincipalAddress();

    if (routeCartId) {
      fetchProductsCart(routeCartId);
    }

    if (routeProdId) {
      fetchProductInfo(routeProdId);
    }
  }, [routeProdId, routeCartId]);

  async function handleBuy() {
    if (routeProdId) {
      const { url } = await createStripeSession(routeProdId);
      window.location.href = url;
    } else if (routeCartId) {
      const { url } = await createStripeSessionCart(routeCartId);
      window.location.href = url;
    }
  }

  useEffect(() => {
    async function fetchCustomUser() {
      const user = await getCustomUserInfo();
      setCustomUser(user);
    }

    fetchCustomUser();
  }, []);

  useEffect(() => {
    fetchThePrincipalAddress();
  }, []);

  console.log(customUser?.accept_delivery);

  return (
    <>
      <Helmet title="Confirmar Endereço" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Revisão do Pedido</h1>
          <div className="flex flex-col gap-6 px-3 lg:flex-row">
            <div className="flex w-2/3 flex-col gap-10">
              <div>
                <p className="pb-2 text-xl">Informações do Cliente</p>
                <div className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-100 p-4 shadow-md">
                  <div>
                    <p className="text-lg font-medium">{customUser?.name}</p>
                    <p>CPF: {customUser?.cpf}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="pb-2 text-xl">Detalhes da Entrega</p>
                <div className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-100 p-4 shadow-md">
                  {customUser?.accept_delivery && address && (
                    <div>
                      <p className="text-lg font-medium">
                        {address.road} {address.number}
                        {address.complement
                          ? ` - ${address.complement}`
                          : ""} - {address.city}
                      </p>
                      <p>Receber no meu Endereço</p>
                    </div>
                  )}

                  {!customUser?.accept_delivery && (
                    <div>
                      <p className="text-lg font-medium">Retirar na loja</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="pb-2 text-xl">Produto(s)</p>
                <div className="flex cursor-pointer flex-col items-start gap-3 rounded-lg bg-slate-100 p-4 shadow-md">
                  {Array.isArray(productsCart) &&
                    productsCart.length > 0 &&
                    productsCart.map((productInfo) => (
                      <div key={productInfo.id} className="flex w-full gap-3">
                        <img
                          className="h-24 w-24 rounded-lg border-slate-200 sm:w-28"
                          src={`http://localhost:3000/${productInfo.images[0].path}`}
                          alt=""
                        />
                        <div className="flex w-full flex-col gap-2">
                          <p className="text-xl">{productInfo.name_product}</p>
                          <p>Quantidade: {productInfo.units}</p>
                        </div>
                      </div>
                    ))}

                  {product &&
                    [product].map((productInfo) => (
                      <div key={productInfo.id} className="flex w-full gap-3">
                        <img
                          className="h-24 w-24 rounded-lg border-slate-200 sm:w-28"
                          src={`http://localhost:3000/${productInfo.images[0].path}`}
                          alt=""
                        />
                        <div className="flex w-full flex-col gap-2">
                          <p className="text-xl">{productInfo.name_product}</p>
                          <p>Quantidade: 1</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-8 border-black lg:w-1/3 lg:border-l lg:pl-10">
              <div
                className="grid grid-rows-3"
                style={{ gridTemplateRows: "auto 45px" }}
              >
                <SaleInfo productsCart={productsCart} product={product} />

                <button
                  onClick={() => handleBuy()}
                  className="flex items-center justify-center rounded-lg bg-orange_button p-1 text-xl font-semibold text-white"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
