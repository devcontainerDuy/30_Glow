import React from "react";
import { PermissionProps } from "@/types";

export const AuthorizationContext = React.createContext<PermissionProps[]>([]);
export const useAuthorization = () => React.useContext(AuthorizationContext);

export default AuthorizationContext.Provider;