//
import Plx from "react-plx";
import { useEffect, useState } from "react";
import s from "./Carousel.module.scss";

const CarouselItem = (props: any) => {
  const { index } = props;

  return (
    <div className={s.item}>
      <img src={`/gogo/${(index % 20) + 1}.jpg`} className="rounded-3xl" />
    </div>
  );
};

const Carousel = (props: any) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  if (!isClient) {
    return null;
  }

  const items = new Array(11)
    .fill(0)
    .map((v, i) => <CarouselItem key={i} index={i} />);

  const items2 = new Array(11)
    .fill(0)
    .map((v, i) => <CarouselItem key={i + 11} index={i + 11} />);

  return (
    <div
      className="-rotate-3 bg-pallete-primary py-4"
      style={{
        margin: "100px 0",
        transform: "scale(1.1) rotate(-3deg)",
      }}
    >
      <Plx
        parallaxData={[
          {
            start: "self",
            end: "self",
            endOffset: "100vh",
            properties: [
              {
                startValue: 0,
                endValue: -100,
                unit: "%",
                property: "translateX",
              },
            ],
          },
        ]}
      >
        <div className="w-full flex flex-row items-center">{items}</div>
      </Plx>
      <Plx
        parallaxData={[
          {
            start: "self",
            end: "self",
            endOffset: "100vh",
            properties: [
              {
                startValue: -100,
                endValue: 0,
                unit: "%",
                property: "translateX",
              },
            ],
          },
        ]}
      >
        <div className="mt-4 w-full flex flex-row items-center">{items2}</div>
      </Plx>
    </div>
  );
};

export default Carousel;
