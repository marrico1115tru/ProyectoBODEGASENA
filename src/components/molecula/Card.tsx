interface CardProps {
  title: string;
  content: string;
}

export const Card = ({ title, content }: CardProps) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p>{content}</p>
    </div>
  );
};
