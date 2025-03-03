export const GrowRoles = {
  owner: "owner",
  grower: "grower",
  trimmer: "trimmer",
  seller: "seller",
  consultant: "consultant",
  viewer: "viewer",
  admin: "admin",
} as const;

export type GrowRoles = (typeof GrowRoles)[keyof typeof GrowRoles];
