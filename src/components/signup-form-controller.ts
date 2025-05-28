import { FReturn } from "@/lib/__types__/FReturn";

export type OnSignupReturnType = FReturn<{
  message: string;
  redirectTo?: string;
}>;

export type OnSignupCallbackType = (
  email: string,
  password: string
) => Promise<OnSignupReturnType>;

export class SignupFormController {
  static async hanldeSubmit(
    formData: FormData,
    onSignup: OnSignupCallbackType
  ): Promise<OnSignupReturnType> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await onSignup(email, password);
    return result;
  }
}
