import React from 'react';
import Image from 'next/image';
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
      'https://images.pexels.com/photos/29150722/pexels-photo-29150722/free-photo-of-osniezone-szczyty-w-sissu-himachal-pradesh.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 20000.0,
    tripLength: 7
  },
  {
    id: 2,
    name: 'Rann Utsav Kutch Gujarat',
    image:
      'https://images.pexels.com/photos/19220904/pexels-photo-19220904/free-photo-of-krajobraz-indie-mokradlo-bagno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 10000.0,
    tripLength: 4
  },
  {
    id: 3,
    name: 'Jaipur Rajasthan',
    image:
      'https://images.pexels.com/photos/29624131/pexels-photo-29624131/free-photo-of-ozdobna-architektura-fortu-amber-w-dzajpurze-w-indiach.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 15000.0,
    tripLength: 5
  },
  {
    id: 4,
    name: 'Goa Beaches',
    image:
      'https://images.pexels.com/photos/27869485/pexels-photo-27869485/free-photo-of-morze-krajobraz-natura-zachod-slonca.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 15000.0,
    tripLength: 14
  }
];

const TopDestination = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto">
      <div className=" mb-6">
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
            {tempData.map(({ id, name, image }) => (
              <CarouselItem
                key={id}
                className="basis-1/2 md:basis-1/3 flex items-center justify-center"
              >
                <div className="bg-white p-3 shadow-xl rounded-3xl">
                  <Image
                    src={image}
                    alt={name}
                    width={400}
                    height={400}
                    className="rounded-3xl object-cover w-64 md:w-75 aspect-video"
                  />

                  <p className='block w-full text-lg font-medium mt-3'>{name}</p>
                  <div className="flex items-center justify-between w-full">
                    <p></p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TopDestination;
