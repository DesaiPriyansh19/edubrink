import React from "react";
import ResultsCorses from "./Resultscorse";
import ResultsBlog from "./ResultsBlog";
import Univrsiry from "./University";

function Results({ filteredData, loading }) {
  return (
    <div className="bg-transparent">
      <ResultsCorses
        loading={loading}
        // filteredData={filteredData?.flatMap((item) =>
        //   item.universities.flatMap((university) =>
        //     university.courseId.map((course) => ({
        //       ...course,
        //       courseId: course,
        //       uniName: university.uniName,
        //       countryName: item.countryName,
        //     }))
        //   )
        // )}
        filteredData={filteredData?.courses}
      />
      <Univrsiry
        filteredData={filteredData?.universities}
        // filteredData={filteredData?.flatMap((item) =>
        //   item?.universities?.map((university) => ({
        //     ...university,
        //     countryName: item?.countryName,
        //   }))
        // )}
        loading={loading}
      />
      <ResultsBlog
        // filteredData={filteredData?.flatMap((item) =>
        //   item?.blog?.map((blogs) => ({
        //     ...blogs,
        //     countryName: item?.countryName,
        //   }))
        // )}
        filteredData={filteredData?.blogs}
        loading={loading}
      />
    </div>
  );
}

export default Results;
