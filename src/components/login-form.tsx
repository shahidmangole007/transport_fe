import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
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

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    console.log(data);

    if (data.username === "admin" && data.password === "7777") {
      navigate("/dashboard");
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>

            <p className="text-sm text-balance text-muted-foreground">
              Enter your username below to login and continue
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>

            <Input
              id="username"
              type="text"
              placeholder="example"
              {...register("username")}
            />

            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </Field>

          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            <Input id="password" type="password" {...register("password")} />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </Field>

          <Field>
            <Button type="submit">Login</Button>
          </Field>

          {/* Login Failure Alert */}
          { loginDialogOpen && (
            <Alert variant={"destructive"} className="max-w-md mt-1 ">
            <AlertCircleIcon />
            <AlertTitle>Failed to Login</AlertTitle>
            <AlertDescription>Please check username and password</AlertDescription>
          </Alert>
          )

          }

          <FieldSeparator />

          <Field>
            <FieldDescription className="px-6 text-center">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
