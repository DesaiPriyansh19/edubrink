"use client"

import { useEffect } from "react"
import ManSticker from "../../assets/ManSticker.png"
import Search from "../../assets/SearchStcker.png"
import Book from "../../assets/BookSticker.png"
import Plain from "../../assets/PlanSticker.png"
import bg1 from "../../assets/HowWe1.png"
import bg2 from "../../assets/HowWe2.png"
import bg3 from "../../assets/HowWe3.png"
import bg4 from "../../assets/HowWe4.png"
import { useTranslation } from "react-i18next"
import { useLanguage } from "../../../context/LanguageContext"
import AOS from "aos"
import "aos/dist/aos.css"

function HowWeWork() {
  const { t } = useTranslation()
  const { language } = useLanguage()

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
    AOS.refresh()
  }, [])

  const cards = [
    {
      id: 1,
      bgImage: bg1,
      smallImage: Search,
      smallImagePosition: "absolute -bottom-2 -right-2",
      title: t("HowWeWorkSection.cards.0.title"),
      description: t("HowWeWorkSection.cards.0.description"),
      borderRadius: "rounded-bl-[4rem] rounded-br-[3rem] rounded-tr-[4rem]",
      aosAnimation: "fade-up",
      aosDelay: "0",
    },
    {
      id: 2,
      bgImage: bg2,
      smallImage: Book,
      smallImagePosition: "absolute -top-2 -left-2",
      title: t("HowWeWorkSection.cards.1.title"),
      description: t("HowWeWorkSection.cards.1.description"),
      borderRadius: "rounded-bl-[4rem] rounded-br-[4rem] rounded-tl-[3rem]",
      aosAnimation: "fade-up",
      aosDelay: "100",
    },
    {
      id: 3,
      bgImage: bg3,
      smallImage: Plain,
      smallImagePosition: "absolute -bottom-2 -left-2",
      title: t("HowWeWorkSection.cards.2.title"),
      description: t("HowWeWorkSection.cards.2.description"),
      borderRadius: "rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem]",
      aosAnimation: "fade-up",
      aosDelay: "200",
    },
    {
      id: 4,
      bgImage: bg4,
      smallImage: Book,
      smallImagePosition: "absolute -top-2 -left-2",
      title: t("HowWeWorkSection.cards.3.title"),
      description: t("HowWeWorkSection.cards.3.description"),
      borderRadius: "rounded-br-[4rem] rounded-bl-[4rem] rounded-tl-[4rem]",
      aosAnimation: "fade-up",
      aosDelay: "300",
    },
  ]

  return (
    <div className="max-w-[1240px] mb-20 px-0 md:px-4 mx-auto">
      <h1
        className="text-3xl sm:text-4xl font-semibold flex items-center gap-3 justify-center text-center mb-4"
        data-aos="fade-down"
      >
        {t("HowWeWorkSection.title")}
        <img className="w-8 h-8 sm:w-auto sm:h-auto" src={ManSticker || "/placeholder.svg"} alt="Man sticker" />
      </h1>
      <p
        className="text-[.8rem] font-medium max-w-2xl mx-auto px-10 md:px-12 md:p-0 text-center mb-6"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {t("HowWeWorkSection.description")}
      </p>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex justify-between mb-16 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-auto p-4 lg:px-0 lg:w-1/4 mx-auto"
              data-aos={card.aosAnimation}
              data-aos-delay={card.aosDelay}
            >
              <div className="relative transition-transform duration-300 hover:shadow-md rounded-2xl overflow-hidden group">
                <img
                  src={card.bgImage || "/placeholder.svg"}
                  alt={`Step ${card.id}`}
                  className={`w-full h-auto object-contain ${card.borderRadius}`}
                />
                <div
                  className={`${card.smallImagePosition} transition-transform duration-300 group-hover:translate-y-[-2px]`}
                >
                  <img src={card.smallImage || "/placeholder.svg"} alt="Icon" className="w-[30%] h-[30%]" />
                </div>
              </div>
              <div className="mt-4 transition-all duration-300 group-hover:translate-x-1">
                <p className="font-semibold sm:font-medium text-black transition-colors duration-300 hover:text-[#380C95]">
                  {card.title}
                </p>
                <p className="text-black text-[.8rem] font-light">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowWeWork

