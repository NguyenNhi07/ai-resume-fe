import { Banner } from "@/components/home/Banner";
import { CallToAction } from "@/components/home/CallToAction";
import { Feature } from "@/components/home/Feature";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home () {
    return (
        <div className="pt-[88px]">
            <Banner />
            <Hero />
            <Feature />
            <Testimonials />
            <CallToAction />
            <Footer />
        </div>
    )
}