import React, { useEffect, useState } from "react";

import HomeSvg from "../../../svg/HomeSvg";
import { ResponsiveLine } from "@nivo/line";
import { data, pieData } from "./data";
import { ResponsivePie } from "@nivo/pie";
import useFetch from "../../../hooks/useFetch";
export const commonProperties = {
  margin: { top: 80, right: 80, bottom: 60, left: 80 },
  innerRadius: 0.5,
  padAngle: 0.7,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  colors: { scheme: "tableau10" },
  borderWidth: 1,
  borderColor: "#000000",
  arcLinkLabelsSkipAngle: 3,
  arcLinkLabelsTextColor: "#ffffff",
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: "color" },
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: "#000000",
};

export default function MainDashBoard() {


  const [cardsData, setCardsData] = useState([
    {
      title: "Post Property",
      value: 0,
      goal: 100,
      description: "Total Post",
      progressColor: "#ef476f",
      percentage: 0,
    },
    {
      title: "Total Enquiry Today",
      value: 0,
      goal: 100,
      description: "Enquiries Today",
      progressColor: "#4ecdae",
      percentage: 0,
    },
    {
      title: "Total Requirement Today",
      value: 0,
      goal: 100,
      description: "Requirements Today",
      progressColor: "#ff9f1c",
      percentage: 0,
    },
  ]);

  // useEffect(() => {
  //   if (data) {
  //     setCardsData((prevCards) =>
  //       prevCards.map((card) => {
  //         if (card.title === "Post Property") {
  //           return {
  //             ...card,
  //             value: data?.propertyAdded?.length || 0, // Use `data.posts` for Post Property
  //             percentage: ((data?.propertyAdded.length || 0) / card.goal) * 100, // Calculate percentage
  //           };
  //         }
  //         if (card.title === "Total Enquiry Today") {
  //           return {
  //             ...card,
  //             value: data?.EnquiryAdded.length || 0, // Use `data.enquiries` for Total Enquiry Today
  //             percentage: ((data?.EnquiryAdded.length || 0) / card.goal) * 100, // Calculate percentage
  //           };
  //         }
  //         if (card.title === "Total Requirement Today") {
  //           return {
  //             ...card,
  //             value: data?.RequirementAdded.length || 0, // Use `data.requirements` for Total Requirement Today
  //             percentage:
  //               ((data?.RequirementAdded.length || 0) / card.goal) * 100, // Calculate percentage
  //           };
  //         }
  //         return card; // Default: return the card as-is
  //       })
  //     );
  //   }
  // }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading data</p>;
  return (
    <div className="text-white  mx-auto p-4">
      <p className="text-xl font-semibold uppercase ">DashBoard</p>
      <p className="mb-6 text-sm text-gray-200">Welcome to your Dashboard</p>
      <div className="flex justify-between gap-4 w-full">
        {cardsData.map((card, i) => (
          <div
            key={i}
            className="bg-gray-800  shadow-md w-full relative"
          >
            <div className="p-5 flex justify-between ">
              <div>
                <div className="mb-2">
                  <HomeSvg />
                </div>
                <p className="font-sans mb-1">
                  {card.value} / {card.goal}
                </p>
                <p className="font-mono text-[#4ecdae]">{card.description} </p>
              </div>
              <div className="flex flex-col justify-between">
                <div className="relative w-10 h-10">
                  {/* Circle background */}
                  <div className="absolute w-full h-full rounded-full bg-[#424395]"></div>
                  {/* Progress */}
                  <div
                    className="absolute w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(${card.progressColor} 0% ${card.percentage}%, transparent ${card.percentage}% 100%)`,
                    }}
                  ></div>
                  {/* Inner Circle (optional for hollow look) */}
                  <div className="absolute w-8 h-8 top-1 left-1 rounded-full bg-gray-800 "></div>
                </div>
                <div className="italic text-[#4ecdae]">+{card.percentage}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 mt-4 gap-4">
        <div className="h-[330px] relative bg-gray-800  w-full col-span-4">
          <ResponsiveLine
            data={data}
            margin={{ top: 55, right: 100, bottom: 60, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 20,
              tickRotation: 0,
              legendOffset: 36,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickValues: 5,
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendOffset: -52,
              legendPosition: "middle",
              truncateTickAt: 0,
            }}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "#ffffff", // Axis text color
                  },
                },
                legend: {
                  text: {
                    fill: "#ffffff", // Legend text color
                  },
                },
              },

              legends: {
                text: {
                  fill: "#ffffff", // Set legend text color to white
                },
                symbol: {
                  fill: "#ffffff", // Set legend symbol color to white
                },
              },
            }}
            enableGridX={false}
            enableGridY={false}
            colors={{ scheme: "yellow_orange_red" }}
            lineWidth={3}
            enablePoints={false}
            pointSize={9}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            areaOpacity={0.15}
            enableTouchCrosshair={true}
            useMesh={true}
            tooltip={({ point }) => (
              <div
                style={{
                  padding: 12,
                  color: "black",
                  background: "white",
                  borderRadius: 8,
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="flex justify-center items-center"
              >
                <div
                  style={{ background: `${point.serieColor}` }}
                  className="w-4 h-4 rounded-full"
                ></div>
                <span className="uppercase ml-2">
                  {point.serieId}: {point.data.xFormatted},{" "}
                  {point.data.yFormatted}
                </span>
              </div>
            )}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "white",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
          <div className="absolute top-3 left-3">
            <p className="text-xl font-semibold uppercase ">
              Enquires Generated
            </p>
          </div>
        </div>
        <div className="h-[330px] bg-gray-800 col-span-2 w-full">
          <div className="h-full relative bg-gray-800  w-full col-span-4">
            <ResponsivePie
              data={pieData}
              {...commonProperties}
              tooltip={({ datum: { id, value, color } }) => (
                <div
                  style={{
                    padding: "12px",
                    color: "black",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="flex items-center space-x-2"
                >
                  <div
                    style={{ background: `${color}`, borderRadius: 4 }}
                    className="w-4 h-4 "
                  ></div>
                  <span className="capitalize">
                    {id}: {value}
                  </span>
                </div>
              )}
              // legends={[
              //   {
              //     anchor: "bottom",
              //     direction: "row",
              //     justify: false,
              //     translateX: 10,
              //     translateY: 70,
              //     itemsSpacing: 0,
              //     itemWidth: 100,
              //     itemHeight: 18,
              //     itemTextColor: "#999", // Default text color
              //     itemDirection: "left-to-right",
              //     itemOpacity: 1,
              //     symbolSize: 18,
              //     symbolShape: "circle",
              //     effects: [
              //       {
              //         on: "hover",
              //         style: {
              //           itemTextColor: "#000", // Change text color to black on hover
              //           itemOpacity: 1, // Ensure full opacity when hovering
              //         },
              //       },
              //     ],
              //   },
              // ]}
              theme={{
                tooltip: {
                  container: {
                    background: "#333",
                    color: "#fff", // Tooltip text color
                    borderRadius: "8px",
                    padding: "8px 12px",
                  },
                },
              }}
            />
            <div className="absolute top-3 left-3">
              <p className="text-xl font-semibold uppercase ">
                Popular University
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
