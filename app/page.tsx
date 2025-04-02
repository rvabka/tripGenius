import Hero from '@/components/sections/Hero';
import TopDestination from '@/components/sections/TopDestination';
import TopValues from '@/components/sections/TopValues';

export default function Home() {
  return (
    <div className="px-4 md:px-6">
      <Hero />
      <TopValues />
      <TopDestination />
    </div>
  );
}
