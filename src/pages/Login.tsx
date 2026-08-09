import { LoginForm } from "@/components/login-form-4";
import Logo from "/logo.png";

export default function Login() {
  return (
    <div className="   flex h-screen items-center justify-center">
      <div className="w-5/12 p-8 ">
        <LoginForm></LoginForm>
      </div>
      <div className=" absolute top-8 left-10 h-12 text-3xl   font-semibold  flex justify-center items-end  ">
          <img className="h-12"  src={Logo} alt="no logo image" />
          <div className="font-sans ">leaf<span className="text-[#9BCE40] ps-1 ">ai</span></div>
      </div>
    </div>
  );
}