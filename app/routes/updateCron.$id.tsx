import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormText,
} from "@ant-design/pro-components";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";

import prisma from "~/lib/prisma";

export const action = async (args: ActionFunctionArgs) => {
  const id = args.params.id;
  const body = await args.request.json();
  const cron = await prisma.task.update({
    where: {
      id: Number(id)
    },
    data: {
      name: body.name,
      description: body.description,
      schedule: body.schedule,
    },
  });
  console.log("cron", cron);
  return redirect("/cron");
};

export const loader = async (args: LoaderFunctionArgs) => {
  const id = args.params.id;
  const data = await prisma.task.findUnique({ where: { id: Number(id) } });
  return data
};

export default function CreateCron() {
  const fether = useFetcher();
  const data: any = useLoaderData();
  return (
    <PageContainer>
      <ProForm
        initialValues={data}
        onFinish={(v) => {
          fether.submit(v, { method: "post", encType: "application/json" });
        }}
      >
        {/* 任务名称 */}
        <ProFormText
          name="name"
          label="任务名称"
          placeholder="请输入任务名称"
          rules={[{ required: true, message: "任务名称是必填的" }]}
        />
        {/* 任务描述 */}
        <ProFormText
          name="description"
          label="任务描述"
          placeholder="请输入任务描述"
        />
        {/* Cron 表达式 */}
        <ProFormText
          name="schedule"
          label="Cron 表达式"
          placeholder="请输入Cron表达式"
          rules={[{ required: true, message: "Cron表达式是必填的" }]}
        />
        {/* 任务状态 */}
        {/* <ProFormSelect
          name="status"
          label="任务状态"
          options={[
            { label: "待定", value: "pending" },
            { label: "激活", value: "active" },
            { label: "暂停", value: "paused" },
            { label: "完成", value: "completed" },
            { label: "失败", value: "failed" },
          ]}
          initialValue="pending"
        /> */}
        {/* 下一次运行时间 */}
        <ProFormDateTimePicker
          name="nextRun"
          label="下一次运行时间"
          placeholder="请选择下一次运行时间"
          rules={[{ required: true, message: "请选择下一次运行时间" }]}
        />
      </ProForm>
    </PageContainer>
  );
}
