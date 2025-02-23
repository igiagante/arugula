import { createApiClient, HttpMethods } from "../server";
import { Product } from "@/lib/db/schema";
import { unstable_cache } from "next/cache";

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDto = Partial<CreateProductDto>;

export async function fetchProducts(): Promise<Product[]> {
  const apiClient = await createApiClient();
  return unstable_cache(
    async () => {
      return apiClient<Product[]>(`/api/products`, HttpMethods.GET);
    },
    ["products-list"],
    {
      revalidate: 60, // Cache for 60 seconds
      tags: ["products"],
    }
  )();
}

export async function fetchProductById(productId: string): Promise<Product> {
  const apiClient = await createApiClient();
  return unstable_cache(
    async () => {
      return apiClient<Product>(
        `/api/products?productId=${productId}`,
        HttpMethods.GET
      );
    },
    [`product-${productId}`],
    {
      revalidate: 60,
      tags: ["products", `product-${productId}`],
    }
  )();
}

export async function createProduct(data: CreateProductDto): Promise<Product> {
  const apiClient = await createApiClient();
  return apiClient<Product, CreateProductDto>(
    `/api/products`,
    HttpMethods.POST,
    undefined,
    data
  );
}

export async function updateProduct(
  productId: string,
  data: UpdateProductDto
): Promise<Product> {
  const apiClient = await createApiClient();
  return apiClient<Product, UpdateProductDto>(
    `/api/products?productId=${productId}`,
    HttpMethods.PATCH,
    undefined,
    data
  );
}

export async function deleteProduct(productId: string): Promise<Product> {
  const apiClient = await createApiClient();
  return apiClient<Product>(
    `/api/products?productId=${productId}`,
    HttpMethods.DELETE
  );
}
