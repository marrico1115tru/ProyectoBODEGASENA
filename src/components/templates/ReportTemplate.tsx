// src/components/templates/ReportTemplate.tsx

import Report from "../organismos/Report";

interface ReportTemplateProps {
  title: string;
  data: any[];
  columns: any[];
  chartData: any[];
  chartKeys: string[];
}

const ReportTemplate = ({
  title,
  data,
  columns,
  chartData,
  chartKeys,
}: ReportTemplateProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
        <Report
          title={title}
          data={data}
          columns={columns}
          chartData={chartData}
          chartKeys={chartKeys}
        />
      </div>
    </div>
  );
};

export default ReportTemplate;
