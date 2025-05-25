import { createContext } from "@lit/context";
import { Router } from "../classes/router";

export const routerContext = createContext<Router>(Symbol("router"));
