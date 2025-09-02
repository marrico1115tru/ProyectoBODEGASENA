"use client";

import { Card, CardBody } from "@heroui/react";

type CustomCardProps = {
  conten?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function CustomCard({ conten, children, className = "" }: CustomCardProps) {
  return (
    <Card className={`glass-card hover:scale-105 transition-transform duration-300 ${className}`}>
      <CardBody>
        {conten && <p className="text-default-500 text-sm mb-2">{conten}</p>}
        {children}
      </CardBody>
    </Card>
  );
}
