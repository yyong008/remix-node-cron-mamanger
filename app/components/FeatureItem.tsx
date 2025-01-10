export const FeatureItem = ({ title, description, icon }: any) => {
  return (
    <div className="w-[300px] p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center items-center mb-4">
        <div className="text-4xl text-blue-500">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-base">{description}</p>
    </div>
  );
};
