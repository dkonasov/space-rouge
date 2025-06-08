import { createContext } from "@lit/context";
import type { Router } from "../classes/router";

export const routerContext = createContext<Router>(Symbol("router"));
