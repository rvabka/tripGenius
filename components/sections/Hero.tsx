import { rocknroll } from "@/lib/fonts"
import TravelSearchForm from "@/components/travel-serach-form"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between lg:-mt-20 md:py-2 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Lewa część */}
      <div className="flex flex-col md:items-start items-center max-w-xl text-center md:text-left z-10">
        <p className="text-base tracking-wider text-gray-500">
          because AI plans trips intelligently 😍
        </p>
        <h1 className={`text-4xl md:text-5xl font-bold leading-tight mt-3 mb-6 ${rocknroll.className}`}>
          Life is short and the world is{" "}
          <span className="text-orange-500 relative">
            Wide!
            <span className="absolute -right-14 top-0 animate-bounce">🌍</span>
          </span>
        </h1>

        <div className="w-20 h-1 bg-orange-500 rounded my-4 md:my-6 mx-auto md:mx-0"></div>

        <div className="mb-10 text-gray-600 dark:text-gray-300">
          Discover amazing destinations with our AI-powered travel planner that creates personalized itineraries just
          for you.
        </div>

        <TravelSearchForm />
      </div>

      {/* Prawa część */}
      <div className="md:relative w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0 mb-40 md:mb-0">
        {/* Zdjęcia */}
        <div className="relative flex flex-col gap-6 mr-36 md:mr-0">
          <div className="relative z-10 transition-all duration-300 hover:scale-105 hover:rotate-2">
            <Image
              src={"/mainPage1.jpeg"}
              alt="trip"
              width={300}
              height={300}
              className={cn(
                "w-80 aspect-2/3 object-cover rounded-3xl shadow-lg z-10",
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

          <Image
            src={"/mainPage2.jpeg"}
            alt="trip"
            width={300}
            height={300}
            className={cn(
              "absolute right-[-150px] top-40 w-70 aspect-2/3 object-cover",
              "rounded-3xl shadow-lg z-0 transition-all duration-300",
              "border-4 border-orange-500 dark:border-orange-700",
              "hover:scale-105 hover:-rotate-2 hover:shadow-orange-200",
            )}
          />
        </div>
      </div>

      {/* Dekoracyjne elementy tła */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full filter blur-3xl opacity-30 -z-10"></div>
    </section>
  )
}

export default Hero

