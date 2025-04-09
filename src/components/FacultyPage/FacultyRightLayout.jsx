import React, { useState } from "react";
import Download from "../../../svg/Download";
import DatePicker from "../../../svg/DatePicker";
import Seconds from "../../../svg/Seconds";
import CourseBook from "../../../svg/CourseBook";
import CourseDiscount from "../../../svg/CourseDiscount";
import TicketDiscount from "../../../svg/TicketDiscount";
import Watch from "../../../svg/Watch";
import UniversityRightLayoutCard from "./FacultyLayoutCard";
import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import ShareCard from "../../../utils/ShareCard";
import FacultyRightLayoutCard from "./FacultyLayoutCard";

const FacultyRightLayout = ({ data, language }) => {
  const courseUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-5">
        <div className="container">
          <div className="bg-white shadow rounded-xl mt-5">
            <div className="mt-6">
              <div>
                <div className="order-1  w-full py-4 rounded-lg">
                  <div className="gap-4 bg-white  rounded-b-[1.5rem]">
                    <div className="flex items-center px-[10%] py-[1%] gap-4">
                      <div className="flex items-center justify-center">
                        <TicketDiscount />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          ${data?.uniTutionFees}{" "}
                          {t("UniversitySlugPage.PerYear")}
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          {t("UniversitySlugPage.InterFees")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t mt-4"></div>
                    <div className="flex items-center px-[10%] py-[1%] gap-4 mt-[4%]">
                      <div className="flex items-center justify-center">
                        <Watch />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          {data?.uniDuration}
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          {t("majorPage.duration")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t mt-4"></div>
                    <div className="flex items-center gap-4 px-[10%] py-[1%] mt-5 mb-5">
                      <div className="flex items-center justify-center">
                        <DatePicker />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          {data?.uniStartDate
                            ? new Date(data.uniStartDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          {t("UniversitySlugPage.StartMonth")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t mt-4"></div>
                    <div className="flex items-center gap-4 px-[10%] py-[1%] mt-5 mb-5">
                      <div className="flex items-center justify-center">
                        <Seconds />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          {data?.uniDeadline
                            ? new Date(data.uniDeadline).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          {t("UniversitySlugPage.ApplicationDeadline")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t mt-4"></div>
                    <div className="flex items-center gap-4 px-[10%] py-[1%] mt-5">
                      <div className="flex items-center justify-center">
                        <CourseBook />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          {language === "ar"
                            ? data?.courses[0]?.ModeOfStudy?.ar?.[0]
                            : data?.courses[0]?.ModeOfStudy?.en?.[0]}
                        </p>

                        <p className="text-sm font-sans font-normal leading-5">
                          {t("UniversitySlugPage.ModeOfStudy")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t mt-4"></div>
                    <div className="flex items-center px-[10%] py-[1%] gap-4 mt-5">
                      <div className="flex items-center justify-center">
                        <CourseDiscount />
                      </div>
                      <div>
                        <p className="text-lg font-medium leading-5">
                          {t("UniversitySlugPage.Discount")}
                        </p>
                        <p className="text-sm font-sans font-normal leading-5">
                          {language === "ar"
                            ? data?.uniDiscount?.ar
                            : data?.uniDiscount?.en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FacultyRightLayoutCard />
      </div>
      <ShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        contentTitle={data?.uniName?.[language] || "University"}
        contentType={"university"}
        contentUrl={courseUrl}
      />
    </>
  );
};

export default FacultyRightLayout;
