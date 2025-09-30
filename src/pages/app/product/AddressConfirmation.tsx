/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

import SaleInfo from "@/components/SaleInfo";
import {
  getPrincipalAddress,
  markAddressAsPrincipal,
  markToPickUpInStore,
} from "@/pages/api/address-module";
import { getProductInfo } from "@/pages/api/get-all-products";
import { getCustomUserInfo } from "@/pages/api/get-profile";
import { getProductsFromSpecificShoppingCart } from "@/pages/api/get-shopping-cart-products";

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
  units?: number;
  images: [{ id: string; path: string; fk_product: string }];
};

type CustomUser = {
  cpf: string;
  name: string;
  birthday: Date;
  email: string;
  accept_delivery: boolean;
};

export function AddressConfirmation() {
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address>();
  const [product, setProduct] = useState<Product>();
  const [productsCart, setProductsCart] = useState<Product[]>([]);
  const [, setCustomUser] = useState<CustomUser>();
  const [selectedMethod, setSelectedMethod] = useState<
    "delivery" | "withdrawal"
  >("withdrawal");

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

  async function alterDeliveryMethod(addressId?: string) {
    if (addressId) {
      await markAddressAsPrincipal(addressId);
    } else {
      await markToPickUpInStore();
    }
  }

  function handleContinue() {
    if (routeProdId) {
      navigate(`/orderSummary/product/${routeProdId}`);
    } else if (routeCartId) {
      navigate(`/orderSummary/cart/${routeCartId}`);
    }
  }

  useEffect(() => {
    async function fetchCustomUser() {
      const user = await getCustomUserInfo();
      setCustomUser(user);

      // Define o método de entrega baseado no perfil
      setSelectedMethod(user?.accept_delivery ? "delivery" : "withdrawal");
    }

    fetchCustomUser();
  }, []);

  function onGoToMyAddresses() {
    if (routeCartId) {
      navigate(`/myAddresses/saleCart/${routeCartId}`)
    }
    else if (routeProdId) {
      navigate(`/myAddresses/saleProduct/${routeProdId}`)
    }
  }

  useEffect(() => {
    fetchThePrincipalAddress();
  }, []);

  return (
    <>
      <Helmet title="Confirmar Endereço" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Forma de entrega</h1>
          <div className="flex flex-col gap-6 px-3 lg:flex-row">
            <div className="flex w-2/3 flex-col gap-10">
              <div>
                <label
                  htmlFor="delivery"
                  className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-100 p-4 shadow-md"
                >
                  <input
                    id="delivery"
                    type="radio"
                    name="delivery_method"
                    className="mt-2 scale-150"
                    checked={selectedMethod === "delivery"}
                    onChange={() => {
                      setSelectedMethod("delivery");
                      address?.id && alterDeliveryMethod(address.id);
                    }}
                  />
                  <div>
                    <p className="text-lg font-medium">
                      Receber no meu Endereço
                    </p>
                    <p>
                      {address?.road} {address?.number}
                      {address?.complement
                        ? ` - ${address.complement}`
                        : ""}- {address?.city}
                    </p>
                  </div>
                </label>
                <button onClick={() => onGoToMyAddresses()} className="mt-3 w-fit rounded-lg bg-blue-400 p-2 font-bold text-white">
                  Editar Endereço ou escolher outro
                </button>
              </div>

              <label
                htmlFor="withdrawal"
                className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-100 p-4 shadow-md"
              >
                <input
                  id="withdrawal"
                  type="radio"
                  name="delivery_method"
                  className="mt-2 scale-150"
                  checked={selectedMethod === "withdrawal"}
                  onChange={() => {
                    setSelectedMethod("withdrawal");
                    alterDeliveryMethod();
                  }}
                />
                <div>
                  <p className="text-lg font-medium">Retirar na Loja</p>
                </div>
              </label>
            </div>

            <div className="flex w-full flex-col gap-8 border-black lg:w-1/3 lg:border-l lg:pl-10">
              <div
                className="grid grid-rows-3"
                style={{ gridTemplateRows: "auto 45px" }}
              >
                <SaleInfo productsCart={productsCart} product={product} />

                <button
                  onClick={() => handleContinue()}
                  className="flex items-center justify-center rounded-lg bg-orange_button p-1 text-xl font-semibold text-white"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressConfirmation;
