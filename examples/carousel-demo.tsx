import { Carousel, CarouselSlide } from "@/components/ui/Carousel";

export default function CarouselDemo() {
  return (
    <div className="w-full">
      <Carousel
        autoPlay
        interval={4500}
        items={[
          <CarouselSlide key="a" theme="dark" title={<>the quiet art<br />of long-form writing</>} meta="8 min read · writing" />,
          <CarouselSlide key="b" theme="tint" tint="#8A8E7A" title={<>designing with<br />constraints</>} meta="5 min read · design" />,
          <CarouselSlide key="c" theme="light" title={<>on building<br />in public</>} meta="4 min read · indie" />,
        ]}
      />
    </div>
  );
}
