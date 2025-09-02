"use client";

import CustomCard from "../../components/molecula/Card";

type CardInfoProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

export default function CardInfo({ label, value, icon }: CardInfoProps) {
  return (
    <CustomCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
        </div>
        <div className="icon-glass">{icon}</div>
      </div>
    </CustomCard>
  );
}
