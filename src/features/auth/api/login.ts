import { loginWithEmailPassword } from "@/core/coreClient";

export type LoginInput = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginInput) {
  const res = await loginWithEmailPassword({
    email: data.email,
    password: data.password,
  });

  return res;
}
