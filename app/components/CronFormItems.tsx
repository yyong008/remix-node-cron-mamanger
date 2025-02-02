import { ProFormDateTimePicker, ProFormText } from "@ant-design/pro-components";

export default function CronFormItems() {
  return (
    <>
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
      <ProFormText
        name="function_name"
        label="Cron 函数名"
        placeholder="请输入Cron函数"
        rules={[{ required: true, message: "Cron函数是必填的" }]}
      />
      <ProFormText
        name="function_params"
        label="Cron Params"
        placeholder="请输入Cron函数参数"
        rules={[{ required: false, message: "Cron函数参数是必填的" }]}
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
    </>
  );
}
