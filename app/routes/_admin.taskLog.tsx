import { PageContainer, ProTable } from "@ant-design/pro-components";

import { LoaderFunction } from "@remix-run/node";
import prisma from "~/lib/prisma";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const data = await prisma.taskLog.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return data;
};

export default function TastLog() {
  const data = useLoaderData<typeof loader>();
  return (
    <PageContainer title="Task Log">
      <ProTable
        search={false}
        dataSource={data}
        columns={[
          {
            title: "任务Log Id",
            dataIndex: "id",
            valueType: "id",
          },
          {
            title: "任务 id",
            dataIndex: "task_id",
            valueType: "task_id",
          },
          {
            title: "任务名称",
            dataIndex: "name",
            valueType: "name",
          },
          {
            title: "任务状态",
            dataIndex: "status",
            valueType: "status",
          },
          
          {
            title: "error_message",
            valueType: "error_message",
            dataIndex: "error_message",
          },
        ]}
      ></ProTable>
    </PageContainer>
  );
}
