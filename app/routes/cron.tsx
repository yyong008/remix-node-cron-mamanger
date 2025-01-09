import { Link, useLoaderData } from "@remix-run/react";
import { PageContainer, ProTable } from "@ant-design/pro-components";

import prisma from "~/lib/prisma";

export const loader = async ({ request, context }) => {
  console.log("context", context)
  const data = await prisma.task.findMany();
  return data;
};

export default function Corn() {
  const data = useLoaderData();
  return (
    <PageContainer>
      <ProTable
        search={false}
        dataSource={data ?? []}
        columns={[
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
        ]}
      ></ProTable>
    </PageContainer>
  );
}
