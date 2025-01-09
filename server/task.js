import { PrismaClient, TaskStatus } from "@prisma/client";

import cron from "node-cron";

const prisma = new PrismaClient();

class CronHandler {
  backupDatabase(task) {
    console.log("Backing up database");
  }
  handlerClearOperateor(task) {
    console.log("Clearing operator log");
  }
  handlerClearLoginLog(task) {
    console.log("Clearing login log");
  }
  handlerClearTaskLog(task) {
    console.log("Clearing task log");
  }
  httpRequest(task) {
    console.log("Making HTTP request");
  }
  sendEmail(task) {
    console.log("Sending email");
  }
}

const ch = new CronHandler();

// 存储活跃的 cron 任务
let activeCronTasks = {};

// 查找所有 ACTIVE 状态的任务
async function findActiveTasks() {
  const activeTasks = await prisma.task.findMany({
    where: {
      status: TaskStatus.ACTIVE,
    },
  });

  return activeTasks;
}

// 启动任务
export async function startTasks() {
  const activeTasks = await findActiveTasks();

  activeTasks.forEach((task) => {
    const scheduledTask = cron.schedule(task.schedule, async () => {
      console.log(`Executing task: ${task.name}`);
      // 执行任务的逻辑
      const functionName = task.functionName; // 获取任务对应的函数名
      if (functionName && typeof ch[functionName] === "function") {
        await ch[functionName](task);
      } else {
        console.log(`No handler for function: ${functionName}`);
      }
    });

    // 将任务添加到 activeCronTasks 中
    activeCronTasks[task.id] = scheduledTask;
  });
}

// 启动所有 ACTIVE 状态的任务

// 创建一个服务器上下文来传递 activeCronTasks
export function getLoadContext() {
  return {
    activeCronTasks,
  };
}
