import { PageContainer, ProForm } from "@ant-design/pro-components";
import { redirect, useFetcher } from "@remix-run/react";

import { ActionFunctionArgs } from "@remix-run/node";
import CronFormItems from "~/components/CronFormItems";
import prisma from "~/lib/prisma";

export const action = async (args: ActionFunctionArgs) => {
  const body = await args.request.json();
  const cron = await prisma.task.create({
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

export default function CreateCron() {
  const fether = useFetcher();
  return (
    <PageContainer>
      <ProForm
        onFinish={(v) => {
          fether.submit(v, { method: "post", encType: "application/json" });
        }}
      >
        <CronFormItems />
      </ProForm>
    </PageContainer>
  );
}
