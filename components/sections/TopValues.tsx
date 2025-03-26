import { cn } from '@/lib/utils';

const options = [
  {
    title: 'Endless Destinations',
    description: 'Explore and plan trips to 500+ locations worldwide.',
    icon: '🗺️'
  },
  {
    title: 'AI Travel Assistant',
    description:
      'Get expert recommendations on attractions, food, and hidden gems.',
    icon: '🤖'
  },
  {
    title: 'Seamless Booking',
    description:
      'Easily book hotels, flights, and activities – all in one place.',
    icon: '✈️'
  }
];

const TopValues = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-start gap-6 md:gap-8">
        <div className="w-full sm:w-64 flex-shrink-0 mb-6 sm:mb-0">
          <p className="text-sm font-bold tracking-wider text-orange-500 uppercase">
            what we serve
          </p>
          <h2 className="text-3xl font-bold leading-tight mt-1">
            Smart Travel Planning<span className="ml-2 animate-pulse">🔥</span>
          </h2>
          <div className="w-20 h-1 bg-orange-500 rounded my-3"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Personalized AI-powered trip plans tailored to your preferences.
          </p>
        </div>

        {options.map(({ title, description, icon }) => (
          <div
            key={title}
            className={cn(
              'group h-50 relative p-5 rounded-xl transition-all duration-300',
              'bg-white dark:bg-gray-800 hover:shadow-lg',
              'border border-gray-100 dark:border-gray-700',
              'hover:border-orange-200 dark:hover:border-orange-800',
              'flex-1 min-w-[250px] sm:max-w-[280px]'
            )}
          >
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{icon}</span>
              <h3 className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
                {title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
            <div className="w-0 group-hover:w-full h-1 bg-orange-500 absolute bottom-0 left-0 transition-all duration-300 rounded-b-xl"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopValues;
