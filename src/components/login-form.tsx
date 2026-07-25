import placeholder from "../assets/placeholder.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { InfoIcon } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = (data: LoginFormData) => {

    console.log(data);
    

    if (data.username === "admin" && data.password === "7777") {
      navigate("/dashboard");
    } else {
      // alert("Invalid username or password");
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6     ", className)} {...props}>
      <Card className="overflow-hidden p-0  ">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form className="p-6 md:p-8 flex-1" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>

                <p className="text-balance text-muted-foreground">
                  Login to Transport Software
                </p>
              </div>

              <Field >
                <FieldLabel htmlFor="username">Username</FieldLabel>

                <Input
                  id="username"
                  placeholder="Enter Username"
                  {...register("username")}
                />

                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </Field>

              <Field >
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {loginError && (
                <Alert variant="destructive">
                   <InfoIcon />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Field >
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={placeholder}
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
