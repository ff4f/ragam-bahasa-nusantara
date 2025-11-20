import * as React from "react";
import { UserContext } from "@/context/UserContext";

export const useUser = () => {
  const ctx = React.useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
    return ctx;
};