import React from "react";
import { useParams } from "react-router-dom";
import MainDashBoard from "./MainDashBoard";
import ManagePeoples from "./ManagePeoples";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import UniCRUD from "./University/UniCRUD";
import CountryCRUD from "./Country/CountryCRUD";

export default function SlugPage() {
  const { slug } = useParams();
  return (
    <div className="w-full h-auto">
      {slug === "dashboard" && <MainDashBoard />}
      {slug === "manage-peoples" && <ManagePeoples />}
      {slug === "add-country" && <CountryCRUD />}
      {slug === "add-universities" && <UniCRUD />}
      {/* {slug === "bar-chart" && <BarChart />}
      {slug === "pie-chart" && <PieChart />}
      {slug === "line-chart" && <LineChart />} */}
    </div>
  );
}
