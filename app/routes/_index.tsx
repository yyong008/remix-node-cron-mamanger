import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { TypeInfo } from "~/components/TypeInfo";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const gridStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(169, 169, 169, .4) 3%, transparent 0),
                      linear-gradient(1turn, rgba(169, 169, 169, .4) 3%, transparent 0)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '100% 100%',
    height: '100vh', // 视口高度
  };
  return (
    <div
      className="flex flex-col h-screen items-center"
      style={gridStyle}
    >
      <div className="flex flex-col items-center justify-center mt-[60px] gap-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-blue-500 bg-clip-text text-transparent">
          <TypeInfo />
        </h1>

        <div className="text-gray-400 mt-[100px] mb-[80px]">本项目由以下技术栈构建：</div>

        <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Remix + Express + Node Cron
        </h1>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Prisma + Postgresql
        </h1>
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
          Antd + @ant-design/pro-components
        </h1>
      </div>

      <div className="flex gap-4">
        <Link to="/cron">
          <div className="flex items-center justify-center mt-[60px]">
            <button className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300">
              Start
            </button>
          </div>
        </Link>

        <Link to="/createCron">
          <div className="flex items-center justify-center mt-[60px]">
            <button className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-yellow-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all duration-300">
              Create
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
