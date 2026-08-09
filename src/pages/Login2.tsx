import Logo from "/logo.png";

import { LoginForm } from "@/components/login-form"

export default function Login2() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-end gap-2 font-medium ">
            <div className="flex size-10 items-center justify-end rounded-md   text-primary-foreground">
            
              <img src={Logo}  alt="" />
            </div>
            <div className=" font-sans text-3xl">leaf<span className="text-[#9BCE40] ps-1 " >ai</span></div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden  lg:block ">
        {/* <img
          src={Logo}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}

        <div className=" absolute  w-full h-full p-7" >
          {/* <div className="bg-[#DEF0DD] p-7 h-full rounded-3xl"> */}
          <div className="bg-[#DEF0DD] p-7 h-full rounded-3xl">
            
          </div>
        </div>


      </div>
    </div>
  )
}
