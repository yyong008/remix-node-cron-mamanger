import { PageContainer, ProTable } from "@ant-design/pro-components";

import { LoaderFunction } from "@remix-run/node";
import { createColumn } from "~/components/CronColumns";
import prisma from "~/lib/prisma";
import { useLoaderData } from "@remix-run/react";

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
    <PageContainer>
      <ProTable
        search={false}
        dataSource={data}
        columns={createColumn()}
      ></ProTable>
    </PageContainer>
  );
}
