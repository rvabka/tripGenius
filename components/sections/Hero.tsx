import { rocknroll } from "@/lib/fonts"
import TravelSearchForm from "@/components/travel-serach-form"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between lg:-mt-14 xl:-mt-8 container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:items-center lg:items-start max-w-xl text-center lg:w-1/2 lg:text-left z-10 lg:pr-8">
        <p className="text-base tracking-wider text-gray-500 mt-4 lg:mt-0">because AI plans trips intelligently 😍</p>
        <h1 className={`text-4xl md:text-5xl font-bold leading-tight my-1 ${rocknroll.className}`}>
          Life is short and the world is{" "}
          <span className="text-orange-500 relative">
            Wide!
            <span className="absolute -right-14 top-0 animate-bounce">🌍</span>
          </span>
        </h1>

        <div className="w-20 h-1 bg-orange-500 rounded my-4 md:my-6 mx-auto lg:mx-0"></div>

        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Discover amazing destinations with our AI-powered travel planner that creates personalized itineraries just
          for you.
        </div>

        <TravelSearchForm />
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center mt-10 lg:mt-0 mb-20 lg:mb-0 py-10 lg:py-0">
        <div className="relative w-full max-w-md h-[400px] md:h-[500px] lg:h-[600px]">
          <div className="absolute left-0 md:left-8 lg:left-0 top-0 z-10 transition-all duration-300 hover:scale-105 hover:rotate-2">
            <Image
              src={"/mainPage1.jpeg"}
              alt="trip"
              width={300}
              height={400}
              className={cn(
                "md:w-64 lg:w-80 aspect-[2/3] object-cover rounded-3xl shadow-lg",
                "border-4 border-white dark:border-gray-800",
                "hover:shadow-orange-200 dark:hover:shadow-orange-900/30",
              )}
            />

            {["🚁", "⛰️", "⛵", "🏖️"].map((emoji, index) => {
              const positions = [
                "absolute -top-4 left-1/2 transform -translate-x-1/2",
                "absolute top-1/2 -left-4 transform -translate-y-1/2",
                "absolute top-1/2 -right-4 transform -translate-y-1/2",
                "absolute -bottom-4 left-1/2 transform -translate-x-1/2",
              ]

              return (
                <span
                  key={index}
                  className={cn(
                    positions[index],
                    "bg-white dark:bg-gray-800 p-2 rounded-full",
                    "shadow-md text-2xl transition-all duration-300",
                    "hover:scale-125 hover:rotate-12 cursor-pointer",
                    "border border-gray-100 dark:border-gray-700",
                  )}
                >
                  {emoji}
                </span>
              )
            })}
          </div>

          <div className="absolute right-0 md:right-8 lg:right-0 top-1/3 z-0 transition-all duration-300 hover:scale-105 hover:-rotate-2">
            <Image
              src={"/mainPage2.jpeg"}
              alt="trip"
              width={250}
              height={350}
              className={cn(
                "md:w-56 lg:w-64 aspect-[2/3] object-cover",
                "rounded-3xl shadow-lg",
                "border-4 border-orange-500 dark:border-orange-700",
                "hover:shadow-orange-200",
              )}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full filter blur-3xl opacity-30 -z-10"></div>
    </section>
  )
}

export default Hero
