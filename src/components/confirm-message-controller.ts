import { FReturn } from "@/lib/__types__/FReturn";

export type OnLoadReturnType = FReturn<{
  message: string;
  redirectTo?: string;
}>;

export type OnLoadCallbackType = () => Promise<OnLoadReturnType>;

export class ConfirmMessageController {
  static async handleLoad(
    onLoad: OnLoadCallbackType
  ): Promise<OnLoadReturnType> {
    const result = await onLoad();
    return result;
  }
}
