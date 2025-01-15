import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { commonProperties } from "./data";

export default function PieChart() {

  const data = [
    { id: "java", label: "Java", value: 176, color: "hsl(197, 70%, 50%)" },
    { id: "scala", label: "Scala", value: 594, color: "hsl(75, 70%, 50%)" },
    { id: "ruby", label: "Ruby", value: 418, color: "hsl(132, 70%, 50%)" },
    { id: "php", label: "PHP", value: 361, color: "hsl(266, 70%, 50%)" },
    { id: "css", label: "CSS", value: 341, color: "hsl(285, 70%, 50%)" },
  ];

  return (
    <div className="text-white w-full h-auto mx-auto p-4">
      <p className="text-xl font-semibold uppercase">Custom Pie Chart</p>
      <p className="text-sm text-gray-200">
        Your personalized pie chart with custom tooltips
      </p>
      <div className="w-full h-[90vh]">
        <ResponsivePie
          data={data}
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
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 10,
              translateY: 70,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999", // Default text color
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000", // Change text color to black on hover
                    itemOpacity: 1, // Ensure full opacity when hovering
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
          }}
        />
      </div>
    </div>
  );
}
