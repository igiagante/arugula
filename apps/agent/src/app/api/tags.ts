export const CacheTags = {
  strains: "strains",
  products: "products",
  grows: "grows",
  growById: (id: string) => `grow:${id}`,
  indoors: "indoors",
  plants: "plants",
  userPreferences: "user-preferences",
  strain: (id: string) => `strain:${id}`,
  indoorsByUserId: (userId: string) => `indoors-by-user:${userId}`,
  growByUserId: (userId: string) => `grows-by-user:${userId}`,
  growsByOrganizationId: (organizationId: string) =>
    `grows-by-organization:${organizationId}`,
  indoorByUserId: (userId: string) => `indoor-by-user:${userId}`,
  plantByUserId: (userId: string) => `plant-by-user:${userId}`,
  getPlantsByGrowId: (growId: string) => `plants-by-grow:${growId}`,
  getProductsByUserId: (userId: string) => `products-by-user:${userId}`,
  productById: (id: string) => `product:${id}`,
  tasksByGrowId: (growId: string) => `tasks-by-grow:${growId}`,
  getTaskById: (id: string) => `task:${id}`,
  getUserById: (id: string) => `user:${id}`,
  // Add more cache tags here as needed
} as const;

// Type for static tags
export type StaticCacheTags = Exclude<
  (typeof CacheTags)[keyof typeof CacheTags],
  Function
>;

// Type for dynamic tag functions
export type DynamicCacheTagFn = Extract<
  (typeof CacheTags)[keyof typeof CacheTags],
  Function
>;

// Helper function to create a dynamic tag
export function createDynamicTag<T extends DynamicCacheTagFn>(
  tagFn: T,
  arg: Parameters<T>[0]
): string {
  return tagFn(arg);
}
