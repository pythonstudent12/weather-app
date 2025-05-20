interface LoginResponse {
  token: string;
  error?: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    // For demo purposes, we'll use a simplified approach since the ReqRes API is for testing
    // If this is a test user from ReqRes.in, return a mock token
    if (email === "eve.holt@reqres.in") {
      // Simulate API response with a mock token
      return "QpwL5tke4Pnpja7X4";
    } else {
      throw new Error("Invalid credentials. Use eve.holt@reqres.in with password cityslicka.");
    }
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
}
