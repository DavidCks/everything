import { ReactNode } from "react";
import { toast as soonerToast } from "sonner";
import { SuccessCard } from "./success-card";
import { ErrorCard } from "./error-card";
import { InfoCard } from "./info-card";
import { WarningCard } from "./warning-card";
export const toast = {
  success: (message: ReactNode) => {
    soonerToast.custom(() => (
      <SuccessCard className="relative w-full md:w-sm flex">
        {message}
      </SuccessCard>
    ));
  },
  error: (message: ReactNode) => {
    soonerToast.custom(() => (
      <ErrorCard className="relative w-full md:w-sm flex">{message}</ErrorCard>
    ));
  },
  info: (message: ReactNode) => {
    soonerToast.custom(() => (
      <InfoCard className="relative w-full md:w-sm flex">{message}</InfoCard>
    ));
  },
  warning: (message: ReactNode) => {
    soonerToast.custom(() => (
      <WarningCard className="relative w-full md:w-sm flex">
        {message}
      </WarningCard>
    ));
  },
};
