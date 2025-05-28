import { FReturn } from "@/lib/__types__/FReturn";

export type OnLoginReturnType = FReturn<{
  message: string;
  redirectTo?: string;
}>;

export type OnLoginCallbackType = (
  email: string,
  password: string
) => Promise<OnLoginReturnType>;

export class LoginFormController {
  static async hanldeSubmit(
    formData: FormData,
    onLogin: OnLoginCallbackType
  ): Promise<OnLoginReturnType> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await onLogin(email, password);
    return result;
  }
}
