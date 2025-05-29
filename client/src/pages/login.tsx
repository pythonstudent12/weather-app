import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [location, navigate] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => navigate("/weather"), 100);
      return () => clearTimeout(timer);
      console.log("isAuthenticated:", isAuthenticated); // Проверка после login
      console.log("Trying to navigate to /weather");
    }
    // if (!isAuthenticated) {
    //   const timer = setTimeout(() => navigate(-1), 100);
    //   return () => clearTimeout(timer);
    //   console.log("isAuthenticated:", isAuthenticated); // Проверка после login
    //   console.log("Trying to navigate to app");
    // }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: LoginFormValues) {
    setLoginError(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      toast({
        title: "Login successful",
        description: "You are now logged in.",
      });
      // navigate("/weather");
      // console.log("isAuthenticatedввв:", isAuthenticated); // Проверка после login
      // console.log("Trying to navigateввв to /weather");
    } catch (error) {
      let errorMessage = "Invalid email or password";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto fade-in px-4 sm:px-0">
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
            Login
          </h2>

          {loginError && (
            <Alert
              variant="destructive"
              className="mb-4 p-3 rounded text-sm font-medium bg-error bg-opacity-10 text-error border border-error"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="input-field relative">
                    <FormControl>
                      <Input
                        placeholder=" "
                        type="email"
                        {...field}
                        className="w-full p-3 border border-neutral-300 rounded-md"
                      />
                    </FormControl>
                    <FormLabel className="absolute top-3 left-3 text-neutral-400 pointer-events-none transition-all">
                      Email
                    </FormLabel>
                    <FormMessage className="text-error text-xs mt-1 flex items-center">
                      {form.formState.errors.email && (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="input-field relative">
                    <FormControl>
                      <Input
                        placeholder=" "
                        type="password"
                        {...field}
                        className="w-full p-3 border border-neutral-300 rounded-md"
                      />
                    </FormControl>
                    <FormLabel className="absolute top-3 left-3 text-neutral-400 pointer-events-none transition-all">
                      Password
                    </FormLabel>
                    <FormMessage className="text-error text-xs mt-1 flex items-center">
                      {form.formState.errors.password && (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded hover:bg-opacity-90 transition-colors flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </Button>

              <div className="text-sm text-neutral-400 mt-4 text-center sm:text-left">
                <p>
                  Use <span className="text-primary">eve.holt@reqres.in</span>{" "}
                  with password <span className="text-primary">cityslicka</span>{" "}
                  for testing.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
