import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "buyer" | "supplier";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "buyer" | "supplier";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "buyer" | "supplier";
  }
}
