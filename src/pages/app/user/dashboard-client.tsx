/* eslint-disable prettier/prettier */
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import ProductCard from "@/components/Product";
import { Input } from "@/components/ui/input";
import {
  getOffersDay,
  getRecomendedProductsForLoggedUser,
  getTopOfferDay,
  getTopRatedProduct,
} from "@/pages/api/get-all-products";
import { getCategories } from "@/pages/api/getSubCategories";

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

type Category = {
  id: string;
  category_type: string;
  image_path: string;
};

export function DashboardClient() {
  const navigate = useNavigate()
  const [recomendedProducts, setRecomendedProducts] = useState<Product[]>([]);
  const [offersDay, setOffersDay] = useState<Product[]>([]);
  const [topRateProducts, setTopRateProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topOfferDay, setTopOfferDay] = useState<Product>();

  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    null;

  async function fethCategories() {
    const response = await getCategories();
    setCategories(response);
  }

  async function fethRecomendedProducts() {
    if (token) {
      const response = await getRecomendedProductsForLoggedUser(token);
      setRecomendedProducts(response);
      console.log('Recomended', response)
    }
  }

  async function fethTopRatedProducts() {
    const response = await getTopRatedProduct();
    setTopRateProducts(response);

    console.log('TopRated', response)
  }

  async function fetchOffersDay() {
    const response = await getOffersDay();
    setOffersDay(response);
    console.log('Offers', response)
  }

  async function fetchTopOfferDay() {
    const response = await getTopOfferDay();
    setTopOfferDay(response);
    console.log('TopOffer', response)
  }

  useEffect(() => {
    fethRecomendedProducts();
    fetchOffersDay();
    fethTopRatedProducts();
    fetchTopOfferDay();
    fethCategories();
  }, []);

  return (
    <>
      <Helmet title="" />
      <div className="flex min-h-screen flex-col items-center gap-8 bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <img
              src="http://localhost:3000/uploads/banners/banner01.png"
              alt=""
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-normal">Produtos recomendados</h2>

          <div className="flex gap-3">
            {recomendedProducts.length > 0
              ? recomendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : null}
          </div>
        </div>

        <div className="promotions flex w-full justify-between">
          <div className="flex w-3/4 flex-col gap-6 bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-normal">Promoções do dia</h2>

            <div className="flex gap-3">
              {offersDay.length > 0
                ? offersDay.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : null}
            </div>
          </div>

          <div className="flex w-min flex-col gap-6 bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-normal">Promoção do dia</h2>

            <div className="flex gap-3">
              {topOfferDay ? (
                <ProductCard key={topOfferDay.id} product={topOfferDay} />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-normal">Navegue por categorias</h2>

          <div className="grid grid-cols-8 gap-4">
            {categories.length > 0
              ? categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex h-36 flex-col items-center gap-2 rounded-lg bg-slate-50 p-3 shadow-lg"
                  >
                    <img
                      src={`http://localhost:3000/${category.image_path}`}
                      className="w-10"
                      alt=""
                    />
                    <p
                      className="mb-1 text-slate-800"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                      title={category.category_type}
                    >
                      {category.category_type}
                    </p>
                    <button onClick={() => navigate(`/productsFromCategory/${category.id}`)} className="rounded-md bg-blue-800 px-2 font-medium text-white">
                      Ver Produtos
                    </button>
                  </div>
                ))
              : null}
          </div>
        </div>

        <div className="relative flex w-full flex-col gap-6 bg-blue-800 p-6 shadow-lg mb-8">
          <div className="w-2/4 flex flex-col gap-6">
            <h2 className="text-4xl font-light text-white">
              Cadastre seu email e receba as promoções exclusivas do KaririShop!
            </h2>

            <div className="flex items-center h-12">
              <Input type="text" placeholder="Endereço de Email" className="bg-white rounded-t-sm rounded-r-none rounded-b-none rounded-l-sm h-full"/>
              <button className="bg-blue-600 rounded-sm p-1 h-12 w-12 flex items-center justify-center rounded-t-none rounded-r-sm rounded-b-sm rounded-l-none"><ArrowRight color="#fff" size={30}/></button>
            </div>
            

            <img className="absolute w-32 h-32 bottom-0 right-96" src={`http://localhost:3000/uploads/static/3d_avatar_11.svg`} alt="" />

            <img className="absolute w-32 h-32 top-0 right-32" src={`http://localhost:3000/uploads/static/3d_avatar_30.png`} alt="" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-normal">Produtos mais bem avaliados</h2>

          <div className="flex gap-3">
            {topRateProducts.length > 0
              ? topRateProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
