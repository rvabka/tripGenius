import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const tempData = [
  {
    id: 1,
    name: 'Kullu Manali Himachal Pradesh',
    image:
      'https://images.pexels.com/photos/29150722/pexels-photo-29150722/free-photo-of-osniezone-szczyty-w-sissu-himachal-pradesh.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

const TopDestination = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto">
      <div className="">
        <p className="text-sm font-bold tracking-wider text-accentOrange uppercase">
          top destination
        </p>
        <p className="text-3xl font-bold leading-tight mt-1">
          Discover Top Destination <span className="text-3xl">✈️</span>
        </p>
      </div>
      <div className="">
        <Carousel>
          <CarouselContent>
            <CarouselItem className="basis-1/3"></CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TopDestination;
