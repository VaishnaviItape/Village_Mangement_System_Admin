import React from "react";
import CollectionChart from "./CollectionChart";
import TaxDistributionChart from "./TaxDistributionChart";

function ChartSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <CollectionChart />
      </div>
      <div className="xl:col-span-1">
        <TaxDistributionChart />
      </div>
    </div>
  );
}
export default ChartSection;