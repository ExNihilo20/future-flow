export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(user: {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
