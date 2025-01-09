import { Link } from "@remix-run/react";

export const createColumn = () => {
  return [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "type",
    },
    {
      title: "任务状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "cron 表达式",
      dataIndex: "schedule",
      key: "schedule",
    },
    {
      title: "执行函数",
      dataIndex: "function_name",
    },
    {
      title: "执行函数参数",
      dataIndex: "function_params",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <>
            <Link to={`/updateCron/${record.id}`}>修改</Link>
          </>
        );
      },
    },
  ];
};
