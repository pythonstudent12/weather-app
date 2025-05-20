interface LoginResponse {
  token: string;
  error?: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    // Add the API key to the URL
    const response = await fetch("https://reqres.in/api/login?apiKey=reqres-free-v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.token) {
      throw new Error(data.error || "Invalid email or password");
    }

    return data.token;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
}
