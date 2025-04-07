import React from "react";
import ResultsCorses from "./Resultscorse";
import ResultsBlog from "./ResultsBlog";
import Univrsiry from "./University";
import ResultsMajors from "./ResultsMajors";

function Results({ filteredData, loading }) {
  return (
    <div className="bg-transparent">
      <ResultsMajors loading={loading} filteredData={filteredData?.majors} />
      <Univrsiry filteredData={filteredData?.universities} loading={loading} />
      <ResultsBlog filteredData={filteredData?.blogs} loading={loading} />
    </div>
  );
}

export default Results;
