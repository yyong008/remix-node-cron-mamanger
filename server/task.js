import { TaskStatus } from "@prisma/client";
import cron from "node-cron";
import prisma from "./util";

class CronHandler {
  /**
   * 备份数据库：使用 pg_dump 命令备份数据库
   */
  pgDumpBackupDatabase() {
    console.log("Backing up database");
  }
  /**
   * 清除 api 操作数据库数据
   */
  handlerClearOperateor() {
    console.log("Clearing operator log");
  }
  /**
   * 清除登陆日志
   */
  handlerClearLoginLog() {
    console.log("Clearing login log");
  }
  /**
   * 清除任务日志
   */
  handlerClearTaskLog() {
    console.log("Clearing task log");
  }

  /**
   * 发送邮件
   */
  sendEmail() {
    console.log("Sending email");
  }

  /**
   * 访问页面
   */
  httpRequest() {
    console.log("Making HTTP request");
  }
}

const ch = new CronHandler();


class CronTask {
  /**
   * 活跃的 cron 任务
   */
  activeCronTasks = {};

  /**
   * 获取 remix corn 上下文
   * @returns
   */
  getLoadContext() {
    return {
      activeCronTasks: this.activeCronTasks,
      startTaskById: this.startTaskById,
      stopDeleteTaskById: this.stopDeleteTaskById,
      restartTaskById: this.restartTaskById,
      stopTaskById: this.stopTaskById,
    };
  }

  /**
   * 获取所有活跃的任务
   * @returns
   */
  async findActiveTasks() {
    const activeTasks = await prisma.task.findMany({
      where: {
        status: TaskStatus.ACTIVE,
      },
    });

    return activeTasks;
  }

  /**
   * 启动所有活跃的任务
   */
  async startTasks() {
    const activeTasks = await this.findActiveTasks();

    activeTasks.forEach((task) => {
      const scheduledTask = cron.schedule(task.schedule, async () => {
        console.log(`Executing task: ${task.name}`);
        // 执行任务的逻辑
        const functionName = task.function_name; // 获取任务对应的函数名
        if (functionName && typeof ch[functionName] === "function") {
          await ch[functionName](JSON.parse(task.function_params));
        } else {
          console.log(`No handler for function: ${functionName}`);
        }
      });

      // 将任务添加到 activeCronTasks 中
      this.activeCronTasks[task.id] = scheduledTask;
    });
  }

  /**
   * 停止所有任务
   */
  stopTasks() {
    const { activeCronTasks } = this
    for (const taskId in activeCronTasks) {
      const task = activeCronTasks[taskId];
      task.stop();
    }
  }

  stopTaskById(taskId) {
    const { activeCronTasks } = this
    const task = activeCronTasks[taskId];
    if(!task) {
      console.error(`${taskId} Task not found`)
      return
    }
    task?.stop();
  }

  /**
   * 停止并且删除任务 by id
   * @param {*} taskId
   */
  stopDeleteTaskById(taskId) {
    const { activeCronTasks } = this
    const task = activeCronTasks[taskId];
    if(!task) {
      console.error(`${taskId} Task not found`)
      return
    }
    task.stop();
    delete activeCronTasks[taskId];
  }

  /**
   * 根据 id 重启任务
   * @param {*} taskId
   */
  restartTaskById(taskId) {
    const { activeCronTasks } = this
    const task = activeCronTasks[taskId];
    if(!task) {
      console.error(`${taskId} Task not found`)
      return
    }
    task.stop();
    task.start();
  }

  /**
   *
   * @param {*} taskId
   */
  startTaskById(taskId) {
    const { activeCronTasks } = this
    const task = activeCronTasks[taskId];
    if(!task) {
      console.error(`${taskId} Task not found`)
      return
    }
    task.start();
  }
}

export const cronTask = new CronTask();
