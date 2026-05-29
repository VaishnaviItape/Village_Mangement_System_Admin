import React from "react";
import CollectionChart from "./CollectionChart";
import TaxDistributionChart from "./TaxDistributionChart";

function ChartSection({ data }) {
  if (!data) return null;
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <CollectionChart data={data.collectionTrends} />
      </div>
      <div className="xl:col-span-1">
        <TaxDistributionChart data={data.taxDistribution} />
      </div>
    </div>
  );
}
export default ChartSection;