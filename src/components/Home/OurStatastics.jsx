import React, { useEffect, useState, useRef } from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import HomeLogo from "../../../svg/caplogo/Logo/HomeLogo/Index";
import PeopleLogo from "../../../svg/caplogo/Logo/PeopleLogo";
import { useTranslation } from "react-i18next";

function OurStatastics() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const statistics = [
    {
      title: 16,
      description: t("descriptions.0"),
      logo: <Calander />,
      info: "01",
    },
    {
      title: 230,
      description: t("descriptions.1"),
      logo: <HomeLogo />,
      info: "02",
    },
    {
      title: 1600,
      description: t("descriptions.2"),
      logo: <PeopleLogo />,
      info: "03",
    },
    {
      title: 180,
      description: t("descriptions.3"),
      logo: <Calander />,
      info: "04",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        statistics.forEach((stat, index) => {
          let start = 0;
          const step = Math.ceil(stat.title / 140);

          const animate = () => {
            start += step;
            if (start >= stat.title) {
              setCounts((prev) => {
                const newCounts = [...prev];
                newCounts[index] = stat.title;
                return newCounts;
              });
              return;
            }
            setCounts((prev) => {
              const newCounts = [...prev];
              newCounts[index] = start;
              return newCounts;
            });
            requestAnimationFrame(animate);
          };
          animate();
        });

        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full mb-20">
      <h1 className="text-3xl sm:text-5xl font-semibold text-center mb-8 sm:mb-16">
        {t("descriptionTitle")}
      </h1>

      <div className="grid grid-cols-2 lg:flex rounded-3xl justify-between gap-4 max-w-[1242px] py-4 px-4 mx-auto bg-white">
        {statistics.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-3xl bg-[#F8F8F8] w-auto lg:w-72 text-center"
          >
            <div className="flex items-center justify-between space-x-2 mb-4">
              <p className="text-black font-medium">{item.info}</p>
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full">
                <span className="w-8 h-8 flex items-center justify-center">
                  {item.logo}
                </span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl text-start font-semibold mb-2 md:mb-5">
              {counts[index]}+
            </h3>
            <p className="text-black text-xs sm:text-sm md:text-base text-start font-medium">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurStatastics;
