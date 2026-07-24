import { LoginForm } from "@/components/login-form";

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-4/8 p-8 ">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}