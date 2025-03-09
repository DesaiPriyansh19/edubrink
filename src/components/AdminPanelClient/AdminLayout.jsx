import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useFetch from "../../../hooks/useFetch";

export default function AdminLayout() {
  const baseURL =
    "https://edu-brink-backend.vercel.app/api/helper/notification";

  const { data, loading, refetch } = useFetch(baseURL);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-visible">
        <Header data={data} refetch={refetch} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet context={{ data, loading, refetch }} />
        </main>
      </div>
    </div>
  );
}
