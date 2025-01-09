import { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { PageContainer, ProForm } from "@ant-design/pro-components";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";

import CronFormItems from "~/components/CronFormItems";
import prisma from "~/lib/prisma";

export const action = async (args: ActionFunctionArgs) => {
  const id = args.params.id;
  const body = await args.request.json();
  const cron = await prisma.task.update({
    where: {
      id: Number(id),
    },
    data: {
      name: body.name,
      description: body.description,
      schedule: body.schedule,
      function_name: body.function_name,
      function_params: body.function_params,
    },
  });
  console.log("cron", cron);
  return redirect("/cron");
};

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  const id = args.params.id;
  const data = await prisma.task.findUnique({ where: { id: Number(id) } });
  return data;
};

export default function CreateCron() {
  const fether = useFetcher();
  const data = useLoaderData();
  return (
    <PageContainer>
      <ProForm
        initialValues={data as unknown}
        onFinish={(v) => {
          fether.submit(v, { method: "post", encType: "application/json" });
        }}
      >
        <CronFormItems />
      </ProForm>
    </PageContainer>
  );
}
