import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

// Expiry durations
const ACCESS_TOKEN_EXPIRY = '5m'; // 5 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Generate an Access Token
export const generateToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// Generate a Refresh Token and set it in the HTTP-only cookie
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

// Verify Access Token
export const verifyToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
};

// Verify Refresh Token (check if it is valid without the need for a server-side store)
export const verifyRefreshToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
};

// Revoke the Refresh Token
export const revokeRefreshToken = (): void => {
  // No need to revoke refresh token from memory, as we're using an HTTP-only cookie now.
  // Just remove the cookie from the client-side in the response.
};
