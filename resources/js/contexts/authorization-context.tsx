import { PermissionProps } from "@/types";
import React from "react";

export const AuthorizationContext = React.createContext<PermissionProps[]>([]);
export const useAuthorization = () => React.useContext(AuthorizationContext);

export default AuthorizationContext.Provider;