import Logo from "/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LoginForm } from "@/components/login-form";
import {
  CodeXmlIcon,
  CpuIcon,
  KeyRound,
  LayersIcon,
  ZapIcon,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function Login2() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-end gap-2 font-medium ">
            <div className="flex size-10 items-center justify-end rounded-md   text-primary-foreground">
              <img src={Logo} alt="" />
            </div>
            <div className=" font-sans text-3xl">
              leaf<span className="text-[#9BCE40] ps-1 ">ai</span>
            </div>
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

        <div className=" absolute  w-full h-full p-7    ">
          <div className="bg-[#DEF0DD] p-7 h-full rounded-3xl">
            {/* <div className=" p-7 h-full  rounded-3xl"> */}
            <div className="flex justify-center items-center h-9/12">
              <Carousel
                className="w-full  max-w-xxl sm:max-w-100"
                plugins={[
                  Autoplay({    
                    delay: 3000,
                    stopOnFocusIn : true
                  }),
                ]}
              >
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="bg-[#DEF0DD] text-black">
                          <CardContent className="flex flex-col aspect-square items-center justify-around p-6">
                            <div className="bg-black p-5 rounded-2xl">
                              <LayersIcon
                                size="100  "
                                className="text-green-500"
                              />
                            </div>
                            <div className="text-4xl  font-light  text-center">
                              Batch Processing <br /> with Models
                            </div>
                            <div className="text-sm  text-center">
                              pawn millions of parallel jobs in seconds. Powered
                              by Modal's hyper-elastic compute infrastructure.
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* <CarouselPrevious /> */}
                {/* <CarouselNext /> */}
              </Carousel>
            </div>

            <div className="grid h-3/12 grid-cols-3 items-center justify-center gap-6 text-gray-900  px-6">
              <div className="flex flex-col items-center justify-center text-center text-sm">
                <KeyRound className="mb-2 h-5 w-5" />
                <p>
                  Secure access to
                  <br />
                  powerful solutions
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center text-sm">
                <ZapIcon className="mb-2 h-5 w-5" />
                <p>
                  Fast performance
                  <br />
                  built for you
                </p>
              </div>

              <div className="flex flex-col items-center justify-center text-center text-sm">
                <CodeXmlIcon className="mb-2 h-5 w-5" />
                <p>
                  Modern technology
                  <br />
                  made simple
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
