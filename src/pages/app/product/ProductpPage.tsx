/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { Ellipsis, Heart, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ProductCard from "@/components/Product";
import Stars from "@/components/Stars";
import StarsReview from "@/components/ui/StarsReview";
import { addToCart } from "@/pages/api/add-to-cart";
import {
  getEvaluationsProduct,
  getFkCompanyProductIfno,
  getProductInfo,
  getSimilarProducts,
} from "@/pages/api/get-all-products";

type Product = {
  id: string;
  name_product: string;
  value: number;
  is_on_discount: boolean;
  description: string;
  fk_company: string;
  value_with_discount: number;
  units?: number;
  stock: number;
  images: [{ id: string; path: string; fk_product: string }];
};

type Evaluation = {
  id: string;
  title: string;
  comment: string;
  evaluation: number;
  user_name: string;
};

type CompanyInfo = {
  id: string;
  name: string;
  description: string;
  count_sales: number;
  business_niche: string;
  representative: string;
  road: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
};

const MAGNIFY_SIZE = 200;
const MAGNIFY_SIZE_HALF = MAGNIFY_SIZE / 2;

export function ProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [principalImage, setImage] = useState<{
    id: string;
    path: string;
    fk_product: string;
  }>();
  const [magnifyStyle, setMagnifyStyle] = useState({});
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<number>(0);
  const [reviews, setReviews] = useState<Evaluation[]>([]);
  const [companyInfo, setCompany] = useState<CompanyInfo>();
  const [showFull, setShowFull] = useState(false);

  const { id } = useParams<{ id: string }>();

  async function fetchReviews(id: string) {
    const response = await getEvaluationsProduct(id);
    setReviews(response);
  }

  function updateMagnifyStyle(path: string) {
    const normalizePath = path.replace(/\\/g, "/");
    setMagnifyStyle({
      backgroundImage: `url(${normalizePath})`,
    });
  }

  async function fetchCompanyInfo(product: Product) {
    console.log(product.fk_company)
    const response = await getFkCompanyProductIfno(product.fk_company);
    setCompany(response);
  }

  async function fethProductInfo(id: string) {
    const response = await getProductInfo(id);
    setProduct(response);
    setImage(response.images[0]);

    updateMagnifyStyle(`http://localhost:3000/${response.images[0].path}`);
  }

  useEffect(() => {
    if (id) {
      fethProductInfo(id);
      fetchReviews(id);
      fetchSimilarProducts(id);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchCompanyInfo(product);
    }
  }, [product]);

  async function addProdToCart(units: number, id?: string) {
    if (id) {
      if (units > 0) {
        await addToCart(id, units);
        navigate("/shoppingCart");
      } else {
        toast.error("Selecione a quantidade de unidades!");
      }
    }
  }

  async function fetchSimilarProducts(id: string) {
    const response = await getSimilarProducts(id);
    setSimilarProducts(response);
  }

  function calculateDescont(normalValue: number, promotionValue: number) {
    return (100 - (promotionValue * 100) / normalValue).toFixed(0);
  }

  function calculateDivision(divisors: number, value?: number) {
    if (value) {
      return (value / divisors).toFixed(2);
    }
  }

  function goToAddressConfirmation(id?: string) {
    navigate(`/addressConfirmation/product/${id}`);
  }

  function selectPrincipalImage(image: {
    id: string;
    path: string;
    fk_product: string;
  }) {
    setImage(image);
    updateMagnifyStyle(`http://localhost:3000/${image?.path}`);
  }

  function goToEvaluatePage(id?: string) {
    navigate(`/evaluateProduct/${id}`);
  }

  function formatSalesCount(count: number): string {
    if (count >= 10000) return "+10000 vendas feitas";
    if (count >= 1000) return "+1000 vendas feitas";
    if (count >= 500) return "+500 vendas feitas";
    if (count >= 100) return "+100 vendas feitas";
    if (count > 1) return `${count} vendas feitas`;
    if (count === 1) return "1 venda feita";
    return "Nenhuma venda feita";
  }

  const handleMouseLeave = () => {
    setMagnifyStyle((prev) => ({
      ...prev,
      display: "none",
    }));
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    const { offsetX, offsetY, target } = e.nativeEvent as any;
    const { offsetWidth, offsetHeight } = target;

    const xPercentage = (offsetX / offsetWidth) * 100;
    const yPercentage = (offsetY / offsetHeight) * 100;

    setMagnifyStyle((prev) => ({
      ...prev,
      display: "block",
      top: `${offsetY - MAGNIFY_SIZE_HALF}px`,
      left: `${offsetX - MAGNIFY_SIZE_HALF}px`,
      backgroundPosition: `${xPercentage}% ${yPercentage}%`,
    }));
  };
  return (
    <>
      <Helmet title="Página do Produto" />
      <div className="flex min-h-screen flex-col items-center gap-16 bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <div className="flex gap-8">
            <div className="w-2/5">
              <div className="flex gap-2">
                <div className="flex w-14 flex-col gap-4">
                  {product?.images.map((image) => (
                    <img
                      key={image.id}
                      src={`http://localhost:3000/${image.path}`}
                      alt=""
                      className="bottom-1 h-14 w-full cursor-pointer border-slate-400 object-contain p-1"
                      onMouseEnter={() => selectPrincipalImage(image)}
                    />
                  ))}
                </div>
                <div className="relative mx-auto flex w-fit cursor-none items-start justify-center">
                  <img
                    draggable={false}
                    src={`http://localhost:3000/${principalImage?.path}`}
                    alt=""
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    className="pointer-events-auto h-auto max-h-96 rounded-md border border-slate-200 object-contain shadow-sm"
                    style={{ display: "block" }}
                  />

                  <div className="magify" style={magnifyStyle}></div>
                </div>

                <div className="flex flex-col gap-6">
                  <Heart color="#323743" />
                  <Ellipsis color="#323743" />
                </div>
              </div>
            </div>
            <div className="flex w-2/5 flex-col gap-8">
              <div>
                <h1 className="mb-2 text-4xl font-medium text-black">
                  {product?.name_product}
                </h1>

                {product && <Stars product={product} isCard={false} />}

                <div className="relative">
                  <p className="mt-2 line-clamp-3 text-slate-700">
                    {product?.description}
                  </p>

                  {product?.description &&
                    product?.description?.length > 200 && (
                      <button
                        onClick={() => setShowFull(true)}
                        className="mt-1 text-sm text-blue-600 underline"
                      >
                        Ver mais
                      </button>
                    )}

                  {showFull && (
                    <div className="absolute z-50 mt-2 w-[600px] rounded-md border border-slate-200 bg-white p-4 shadow-lg">
                      <p className="text-sm text-slate-700">
                        {product?.description}
                      </p>
                      <button
                        onClick={() => setShowFull(false)}
                        className="mt-2 text-sm text-blue-600 underline"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {product?.is_on_discount ? (
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center rounded-md bg-orange_button p-1 pb-2 pt-2 text-xl font-bold text-white">
                      -
                      {calculateDescont(
                        product?.value,
                        product?.value_with_discount,
                      )}
                      %
                    </div>
                    <div className="flex items-end gap-1">
                      <p className="flex items-start text-2xl">
                        <span className="text-sm">R$</span>
                        {(Number(product?.value) || 0).toFixed(2)}
                      </p>
                      <p className="text-slate-600 line-through">
                        R${(Number(product?.value_with_discount) || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="flex items-start text-2xl">
                      <span className="text-sm">R$</span>
                      {product?.value}
                    </p>
                    <p>
                      Á vista ou em até 10x de{" "}
                      <span className="text-blue-800">
                        R$ {calculateDivision(10, product?.value)}
                      </span>{" "}
                      sem juros
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <select
                  className="w-2/4 cursor-pointer rounded-xl border border-slate-400 p-3"
                  onChange={(e) => setSelectedUnits(Number(e.target.value))}
                >
                  <option value={0}>Quantidade</option>
                  {Array.from({ length: product?.stock ?? 0 }).map((_, i) => (
                    <option
                      className="cursor-pointer"
                      key={i + 1}
                      value={i + 1}
                    >
                      {i + 1}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => addProdToCart(selectedUnits, product?.id)}
                    className="w-1/2 rounded-full border-2 border-blue-800 p-2 pl-4 pr-4 text-lg font-medium text-blue-800"
                  >
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={() => goToAddressConfirmation(product?.id)}
                    className="w-1/2 rounded-full bg-blue-800 p-2 pl-4 pr-4 text-lg font-medium text-white"
                  >
                    Comprar
                  </button>
                </div>

                <a className="flex cursor-pointer gap-1">
                  <MessageSquare color="#4F4F4F" />
                  <p className="text-blue-800 underline">
                    Relatar um problema com esse produto
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-normal">Conheça produtos semelhantes</h2>
          <div className="flex gap-3">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-normal">Informações da Empresa</h2>
            <button className="cursor-pointer rounded-full bg-orange_button p-1 pl-4 pr-4 font-semibold text-white">
              Ver página da empresa
            </button>
          </div>

          <div className="w-fit rounded-lg border-2 border-blue-800 px-5 py-1">
            <p className="font-bold text-blue-800">
              {formatSalesCount(companyInfo?.count_sales ?? 0)}
            </p>
          </div>

          <div className="grid grid-cols-3">
            <div className="flex flex-col justify-between gap-2">
              <div className="flex gap-5">
                <p className="font-medium">Nome da empresa</p>
                <p>{companyInfo?.name}</p>
              </div>

              <div className="flex gap-5">
                <p className="font-medium">Nicho</p>
                <p>{companyInfo?.business_niche}</p>
              </div>

              <div className="flex gap-5">
                <p className="font-medium">Representante</p>
                <p>{companyInfo?.representative}</p>
              </div>
            </div>

            <div>
              <div className="flex gap-5">
                <p className="font-medium">Descrição</p>
                <p>{companyInfo?.description}</p>
              </div>
            </div>

            <div>
              <div className="flex gap-5">
                <p className="font-medium">Endereço</p>
                <div>
                  <p>
                    {companyInfo?.road}, {companyInfo?.number},{" "}
                    {companyInfo?.neighborhood}
                  </p>
                  <p>
                    {companyInfo?.city}, {companyInfo?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex w-full flex-col gap-6 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-normal">Avaliações</h2>
            <button
              className="cursor-pointer rounded-full bg-orange_button p-1 pl-4 pr-4 font-semibold text-white"
              onClick={() => goToEvaluatePage(product?.id)}
            >
              Avaliar Produto
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded border p-3">
                <p className="text-lg font-medium">{review.user_name}</p>
                <StarsReview rate={review.evaluation} />
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
