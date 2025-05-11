
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const newsItems = [
  {
    id: 1,
    title: "Pakistan Boosts Wheat Production by 15% in Punjab",
    category: "Crop Updates",
    imageUrl: "https://picsum.photos/seed/wheatfield/400/200",
    dataAiHint: "wheat field",
    summary: "The latest reports from Punjab indicate a significant 15% increase in wheat yield this season, thanks to favorable weather and new farming techniques.",
    date: "May 10, 2024",
  },
  {
    id: 2,
    title: "New Irrigation Project Launched in Sindh to Combat Water Scarcity",
    category: "Water Management",
    imageUrl: "https://picsum.photos/seed/irrigationcanal/400/200",
    dataAiHint: "irrigation canal",
    summary: "A major irrigation initiative has been inaugurated in Sindh, aiming to provide sustainable water resources to over 500,000 acres of agricultural land.",
    date: "May 8, 2024",
  },
  {
    id: 3,
    title: "Government Announces Subsidies for Solar Tubewells in Balochistan",
    category: "Technology",
    imageUrl: "https://picsum.photos/seed/solartubewell/400/200",
    dataAiHint: "solar panel",
    summary: "Farmers in Balochistan can now avail subsidies for installing solar-powered tubewells, promoting eco-friendly agriculture and reducing energy costs.",
    date: "May 5, 2024",
  },
  {
    id: 4,
    title: "KP Promotes Organic Farming with New Certification Program",
    category: "Organic Farming",
    imageUrl: "https://picsum.photos/seed/organicfarm/400/200",
    dataAiHint: "organic vegetables",
    summary: "Khyber Pakhtunkhwa introduces a new certification program to encourage organic farming practices, aiming to boost exports of organic produce.",
    date: "May 2, 2024",
  },
  {
    id: 5,
    title: "Mango Exports from Pakistan Expected to Rise This Year",
    category: "Exports",
    imageUrl: "https://picsum.photos/seed/mangoes/400/200",
    dataAiHint: "mango fruit",
    summary: "With a bumper mango crop anticipated, Pakistan's mango exports are projected to see a substantial increase, targeting new international markets.",
    date: "April 28, 2024",
  },
];

export function NewsCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        Latest Agricultural News from Pakistan
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {newsItems.map((news) => (
            <CarouselItem key={news.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader className="p-0">
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      width={400}
                      height={200}
                      className="rounded-t-lg object-cover w-full h-48"
                      data-ai-hint={news.dataAiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{news.category}</Badge>
                      <CardTitle className="text-lg font-semibold mb-1 leading-tight">
                        {news.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mb-2">
                        {news.date}
                      </CardDescription>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {news.summary}
                      </p>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-3 self-start text-primary">Read More</Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
