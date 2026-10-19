"use client";

import Providers from "@/components/Providers";
import Splash from "@/components/Splash";
import { AppBar, TabBar } from "@/components/Chrome";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Shapes from "@/components/Shapes";
import Trends from "@/components/Trends";
import Services from "@/components/Services";
import Manifesto from "@/components/Manifesto";
import Care from "@/components/Care";
import { FinalCTA, Footer, Quotes } from "@/components/Closing";
import BookingSheet from "@/components/BookingSheet";

export default function Home() {
  return (
    <Providers>
      <Splash />
      <AppBar />
      <main>
        <Hero />
        <Marquee items={["Semipermanente", "Kapping", "Soft gel", "Nail art", "Spa de manos"]} dark speed={2} />
        <Shapes />
        <Trends />
        <Services />
        <Manifesto />
        <Care />
        <Quotes />
        <FinalCTA />
        <Footer />
      </main>
      <TabBar />
      <BookingSheet />
    </Providers>
  );
}
