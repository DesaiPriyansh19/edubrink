import React from "react";
import ResultsCorses from "./Resultscorse";
import ResultsBlog from "./ResultsBlog";
import Univrsiry from "./University";

function Results({ filteredData, loading }) {
  return (
    <div className="bg-transparent">
      <ResultsCorses loading={loading} filteredData={filteredData?.courses} />
      <Univrsiry filteredData={filteredData?.universities} loading={loading} />
      <ResultsBlog filteredData={filteredData?.blogs} loading={loading} />
    </div>
  );
}

export default Results;
