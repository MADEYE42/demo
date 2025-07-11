import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey"; // Safe fallback

// Define expected user payload structure
export interface AuthPayload {
  id: string;
  role: "client" | "manufacturer" | "admin"; // Extend as needed
  name?: string;
}

// Sign a token with 7-day expiry
export const signToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// Safely verify token and return the user payload or null
export const verifyToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      return decoded as AuthPayload;
    }
    return null;
  } catch (err) {
    console.error("❌ JWT Verification Error:", err);
    return null;
  }
};
