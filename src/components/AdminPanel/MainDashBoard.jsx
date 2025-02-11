import React, { useEffect, useState } from "react";

import HomeSvg from "../../../svg/HomeSvg";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import useFetch from "../../../hooks/useFetch";
import { ResponsiveBar } from "@nivo/bar";
export const commonProperties = {
  margin: { top: 100, right: 80, bottom: 60, left: 80 },
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

  const { data: Resp } = useFetch(
    "https://edu-brink-backend.vercel.app/api/analysis"
  );

  const transformedData = React.useMemo(() => {
    if (!Resp) return [];

    // Filter only courses and take the top 5 based on total clicks
    const topCourses = Resp.filter((item) => item.category === "Course")
      .sort((a, b) => b.clicks - a.clicks) // Sort by total clicks (descending)
      .slice(0, 5); // Take top 5 courses

    // Get a unique set of all dates to ensure proper x-axis alignment
    const allDates = [
      ...new Set(
        topCourses.flatMap((course) =>
          course.clickHistory.map((entry) => entry.date)
        )
      ),
    ].sort(); // Sorting ensures chronological order

    // Transform data into a format suitable for the bar chart
    return allDates.map((date) => {
      const entry = { date }; // Date is the x-axis label

      topCourses.forEach((course) => {
        const courseEntry = course.clickHistory.find((e) => e.date === date);
        entry[course.itemId.CourseName.en] = courseEntry
          ? courseEntry.clicks
          : 0;
      });

      return entry;
    });
  }, [Resp]);

  const courseNames = React.useMemo(() => {
    if (!Resp || !Array.isArray(Resp)) return [];

    return Resp.filter((item) => item.category === "Course")
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5) // Take the top 5 courses
      .map((course) => course.itemId?.CourseName?.en || "Unknown Course");
  }, [Resp]);

  // const transformedData = React.useMemo(() => {
  //   if (!Resp) return [];

  //   // Filter only courses and take the top 5 based on total clicks
  //   const topCourses = Resp.filter((item) => item.category === "Course")
  //     .sort((a, b) => b.clicks - a.clicks) // Sort by total clicks (descending)
  //     .slice(0, 5); // Take top 5 courses

  //   // Get a unique set of all dates to ensure proper x-axis alignment
  //   const allDates = [
  //     ...new Set(
  //       topCourses.flatMap((course) =>
  //         course.clickHistory.map((entry) => entry.date)
  //       )
  //     ),
  //   ].sort(); // Sorting ensures chronological order

  //   return topCourses.map((course) => ({
  //     id: course.itemId.CourseName.en,
  //     color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`, // Random color
  //     data: allDates.map((date) => {
  //       // Find the entry for this specific date
  //       const entry = course.clickHistory.find((e) => e.date === date);
  //       return {
  //         x: date,
  //         y: entry ? entry.clicks : 0, // If no data for this date, default to 0
  //       };
  //     }),
  //   }));
  // }, [Resp]);

  // const pieData = React.useMemo(() => {
  //   if (!Resp) return [];

  //   // Filter only university data and sort by clicks in descending order
  //   const topUniversities = Resp.filter(
  //     (item) => item.category === "University"
  //   )
  //     .sort((a, b) => b.clicks - a.clicks) // Sort by total clicks (highest first)
  //     .slice(0, 7); // Take the top 7 universities

  //   return topUniversities.map((university) => ({
  //     id: university.itemId.uniName.en, // University name as ID
  //     label: university.itemId.uniName.en, // University name as label
  //     value: university.clicks, // Total clicks
  //     color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`, // Random color
  //   }));
  // }, [Resp]);

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
          <div key={i} className="bg-gray-800  shadow-md w-full relative">
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
        {/* line Graph */}

        {/* <div className="h-[600px] relative bg-gray-800  w-full col-span-6">
          <ResponsiveLine
            data={transformedData}
            margin={{ top: 55, right: 100, bottom: 60, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0, 
              max: "auto",
              stacked: false, 
              reverse: false,
            }}
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
                  fill: "#ffffff", // Legend text color
                },
                symbol: {
                  fill: "#ffffff", // Legend symbol color
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
            pointLabel={(point) => `${point.data.y}`} // ✅ Show actual clicks
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
                  {point.serieId}: {point.data.y}{" "}

                </span>
              </div>
            )}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: 30,
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
                      itemBackground: "black",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />

          <div className="absolute top-3 left-3">
            <p className="text-xl font-semibold uppercase ">POPULAR Courses</p>
          </div>
        </div> */}

        {/* Pie Graph */}

        {/* <div className="h-[330px] bg-gray-800 col-span-3 w-full">
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
              //     translateY: 0,
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
              legends={[
                {
                  anchor: "top-right",
                  direction: "column",
                  justify: false,
                  translateX: 0,
                  translateY: -80,
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
                        itemBackground: "black",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              theme={{
                tooltip: {
                  container: {
                    background: "#333",
                    color: "#fff", // Tooltip text color
                    borderRadius: "8px",
                    padding: "8px 12px",
                  },
                },
                legends: {
                  text: {
                    fill: "#ffffff", // ✅ Set legend text color to white
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
        </div> */}

        {/* <div className="h-[600px] relative bg-gray-800 w-full col-span-6 overflow-x-auto">

          <div
            style={{
              width: `${Math.max(transformedData.length * 100, 1100)}px`,
              height: "100%",
            }}
          >
            <ResponsiveBar
              data={transformedData} // Pass transformed data
              keys={courseNames} // Extract course names as keys
              indexBy="date" // X-axis (dates)
              margin={{ top: 50, right: 130, bottom: 60, left: 60 }}
              padding={0.3} // Reduce padding for better spacing
              groupMode="grouped" // Group bars by date
              colors={{ scheme: "nivo" }} // Predefined color scheme
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45, // ✅ Rotate labels to avoid overlap
                legend: "Date",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                legend: "Clicks",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              theme={{
                axis: {
                  ticks: { text: { fill: "#ffffff" } }, // Axis text color
                  legend: { text: { fill: "#ffffff" } }, // Legend text color
                },
              }}
              tooltip={({ id, value }) => (
                <div
                  style={{
                    background: "#f8f8f8",
                    color: "black",
                    padding: "8px 12px",
                    borderRadius: "6px",
                  }}
                >
                  <p>
                    {id}: {value} clicks
                  </p>
                </div>
              )}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [{ on: "hover", style: { itemOpacity: 1 } }],
                },
              ]}
            />
          </div>


          <div className="absolute top-3 left-3">
            <p className="text-xl font-semibold uppercase">
              Popular Universities
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
