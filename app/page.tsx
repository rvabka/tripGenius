import { rocknroll } from '@/lib/fonts';
import TravelSearchForm from '@/components/travel-serach-form';
import Image from 'next/image';

export default function Home() {
  return (
    <section className="relative text-mainColor flex flex-col md:flex-row items-center justify-between mt-10 px-4 md:px-6 md:py-2 lg:mt-14 lg:py-3">
      {/* Lewa część */}
      <div className="flex flex-col md:items-start items-center max-w-xl text-center md:text-left">
        <p className="text-gray-500 font-medium text-lg">
          because AI plans trips intelligently 😍
        </p>
        <h1
          className={`text-4xl md:text-5xl font-bold leading-tight mt-3 mb-7 ${rocknroll.className}`}
        >
          Life is short and the world is{' '}
          <span className="text-customGreen">Wide!</span>🌍
        </h1>

        <TravelSearchForm />
      </div>

      {/* Prawa część */}
      <div className="md:relative w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0 mb-40 md:mb-0">
        {/* Zdjęcia */}
        <div className="relative flex flex-col gap-6 mr-36 md:mr-0">
          <div className="relative z-10">
            <Image
              src={'/mainPage1.jpeg'}
              alt="trip"
              width={300}
              height={300}
              className="w-80 aspect-2/3 object-cover rounded-full shadow-lg z-10 border-4 border-white"
            />

            <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md text-2xl">
              🚁
            </span>
            <span className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-2xl">
              ⛰️
            </span>
            <span className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-2xl">
              ⛵
            </span>
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md text-2xl">
              🏖️
            </span>
          </div>
          <Image
            src={'/mainPage2.jpeg'}
            alt="trip"
            width={300}
            height={300}
            className="absolute right-[-150px] top-40 w-70 aspect-2/3 object-cover rounded-full shadow-md z-0 border-4 border-accentOrange"
          />
        </div>
      </div>
    </section>
  );
}
