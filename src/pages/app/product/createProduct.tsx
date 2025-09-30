/* eslint-disable prettier/prettier */
import { useMutation } from "@tanstack/react-query";
import { TrashIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/pages/api/create-product";
import { getSubCategories } from "@/pages/api/getSubCategories";

const productForm = z.object({
  name_product: z.string(),
  description: z.string(),
  value: z.number(),
  stock: z.number(),
  sub_category: z.string(),
  files: z.array(z.instanceof(File)).min(1, "Adicione pelo menos uma imagem"),
});

type ProductForm = z.infer<typeof productForm>;

export function CreateProduct() {
  const [subCategories, setSubCategories] = useState<
    { id: string; sub_category_type: string; fk_category: string }[]
  >([]);
  const [files, setFile] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue, 
    formState: { isSubmitting },
  } = useForm<ProductForm>();

  const { mutateAsync: registerProduct } = useMutation({
    mutationFn: createProduct,
  });

  useEffect(() => {
    console.log(files);
  }, [files]);

  useEffect(() => {
    async function loadSubCategories() {
      const response = await getSubCategories();
      setSubCategories(response);
    }

    loadSubCategories();
  }, []);

  function removeImage(index: number) {
    const newArray = files.filter((_, i) => i !== index);
    setFile(newArray);
    setValue("files", newArray);
  }

  async function handleSignUp(data: ProductForm) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await registerProduct(data);

      console.log(response);
      if (response?.errors) {
        response.errors.forEach((error: string) => {
          toast.error(error);
        });
      } else {
        toast.success("Produto cadastrado com sucesso!");
      }
    } catch {
      toast.error("Erro ao realizar o cadastro.");
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-6 md:px-12 lg:px-28">
        <div className="flex w-2/4 flex-col gap-6 bg-white p-6 shadow-lg">
          <h1 className="text-4xl font-light text-black">Cadastrar Produto</h1>
          <form
            method="post"
            onSubmit={handleSubmit(handleSignUp)}
            className="space-y-4"
          >
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="image" className="">
                <div className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-orange_button px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600">
                  <UploadIcon className="h-4 w-4" />
                  Imagem do produto
                </div>
              </Label>

              <Input
                ref={inputRef}
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const fileList = e.target.files;
                  if (fileList?.length) {
                    const filesArray = Array.from(fileList);
                    const newFiles = [...(files ?? []), ...filesArray];
                    setFile((prev) => {
                      const updated = [...prev, ...filesArray];
                      setValue("files", updated);
                      return updated;
                    });
                    setValue("files", [...(files ?? []), ...newFiles]);
                  }
                  e.target.value = "";
                }}
              />

              {files?.length > 0 && (
                <div className="mt-2 grid w-full grid-cols-2 gap-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between rounded-lg border p-1"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="h-12 w-12 object-cover"
                      />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(index)
                        }}
                        className="text-gray-500 transition-colors hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name_product">Nome</Label>
              <Input
                id="name_product"
                type="text"
                placeholder="Teclado gamer"
                required
                {...register("name_product")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                placeholder="Dê uma breve descrição do seu produto"
                required
                className="min-h-[100px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("description")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="38.00"
                required
                {...register("value", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sub_category">Categoria</Label>
              <select
                id="sub_category"
                required
                {...register("sub_category")}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="">Selecione uma subcategoria</option>

                {subCategories.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.sub_category_type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                placeholder="10"
                required
                {...register("stock", { valueAsNumber: true })}
              />
            </div>
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="karirishop"
              className="w-full text-white"
            >
              Finalizar Cadastro
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
