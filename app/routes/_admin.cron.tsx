import { Link, useLoaderData } from "@remix-run/react";
import { PageContainer, ProTable } from "@ant-design/pro-components";

import { Button } from "antd";
import { LoaderFunction } from "@remix-run/node";
import { createColumn } from "~/components/CronColumns";
import prisma from "~/lib/prisma";

export const loader: LoaderFunction = async () => {
  const data = await prisma.task.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return data;
};

export default function Corn() {
  const data = useLoaderData<typeof loader>();
  return (
    <PageContainer title="Cron Task List">
      <ProTable
        search={false}
        dataSource={data}
        columns={createColumn()}
        toolBarRender={() => [<NewTask key="create" />]}
      ></ProTable>
    </PageContainer>
  );
}

function NewTask() {
  return (
    <Link to="/createCron">
      <Button type="primary">New Task</Button>
    </Link>
  );
}
