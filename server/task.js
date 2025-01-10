import * as nm from "nodemailer";

import { TaskStatus } from "@prisma/client";
import cron from "node-cron";
import { prisma } from "./util.js";

const { nodemailer } = nm;
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
  async handlerClearTaskLog() {
    try {
      await prisma.taskLog.deleteMany();
      console.log("Clearing task log");
    } catch (error) {
      console.error("Error clearing task log:", error);
    }
  }

  /**
   * 发送邮件
   */
  async sendEmail(params) {
    try {
      const parsedParams = JSON.parse(params); // 解析传入的 JSON 字符串

      const { host, port, secure, user, pass, from, to, subject, text, html } =
        parsedParams; // 提取邮件参数

      // 创建邮件传输器
      const transporter = nodemailer.createTransport({
        host, // 邮件服务器主机
        port, // 端口
        secure, // 使用 SSL
        auth: {
          user, // 发送邮箱用户名
          pass, // 发送邮箱密码
        },
      });

      // 邮件选项
      const mailOptions = {
        from, // 发件人
        to, // 收件人
        subject, // 邮件主题
        text, // 邮件纯文本内容
        html, // 邮件HTML内容
      };

      // 发送邮件
      const info = await transporter.sendMail(mailOptions);

      console.log("邮件发送成功:", info.messageId); // 打印邮件 ID
      return info; // 返回发送结果
    } catch (error) {
      console.error("发送邮件失败:", error.message);
      throw error; // 重新抛出错误，方便调用者处理
    }
  }

  /**
   * 访问页面
   */
  async httpRequest(params, task) {
    const { createFailTaskLog, createSuccessTaskLog } = this
    try {
      const parsedParams = JSON.parse(params); // 解析传入的 JSON 字符串

      const { method, url, headers, body } = parsedParams; // 提取请求的参数

      const options = {
        method, // 请求方法（GET、POST、PUT、DELETE 等）
        headers, // 请求头
        body: body ? JSON.stringify(body) : undefined, // 请求体（POST、PUT 请求时）
      };

      // 发送请求
      const response = await fetch(url, options);
      createSuccessTaskLog(task)
      // 检查响应状态是否为 2xx
      if (!response.ok) {
        createFailTaskLog(task)
        throw new Error(`请求失败，状态码: ${response.status}`);
      }
      
      // 返回响应数据
      return response.json();
    } catch (error) {
      console.error("请求失败:", error.message);
      createFailTaskLog(task)
      throw error; // 重新抛出错误，方便调用者处理
    }
  }

  async createFailTaskLog(task) {
    const taskId = task.id;
    if (!taskId) {
      console.error("create task log taskId is required");
      return;
    }
    console.log("create task log")
    const t = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    // 创建任务日志
    const taskLog = await prisma.taskLog.create({
      data: {
        tast_id: t.task_id,
        name: t.name,
        status: "FAILURE",
        started_at: t.created_at,
        finished_at: t.updated_at,
        task: {
          connect: {
            id: t.id
          }
        }
      },
    });
    return taskLog;
  }

  async createSuccessTaskLog(task) {
    const taskId = task.id;
    if (!taskId) {
      console.error("create task log taskId is required");
      return;
    }
    console.log("create task log")
    const t = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    // 创建任务日志
    const taskLog = await prisma.taskLog.create({
      data: {
        tast_id: t.task_id,
        name: t.name,
        status: t.status === "ACTIVE" ? "SUCCESS" : "FAIL",
        started_at: t.created_at,
        finished_at: t.updated_at,
        task: {
          connect: {
            id: t.id
          }
        }
      },
    });
    return taskLog;
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
    console.log("start tasks")
    const activeTasks = await this.findActiveTasks();

    activeTasks.forEach((task) => {
      const scheduledTask = cron.schedule(task.schedule, async () => {
        console.log(`Executing task: ${task.name}`);
        // 执行任务的逻辑
        const functionName = task.function_name; // 获取任务对应的函数名
        if (functionName && typeof ch[functionName] === "function") {
          await ch[functionName](JSON.parse(task.function_params), task);
        } else {
          console.error(`No handler for function: ${functionName}`);
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
    const { activeCronTasks } = this;
    for (const taskId in activeCronTasks) {
      const task = activeCronTasks[taskId];
      task.stop();
    }
  }

  stopTaskById(taskId) {
    const { activeCronTasks } = this;
    const task = activeCronTasks[taskId];
    if (!task) {
      console.error(`${taskId} Task not found`);
      return;
    }
    task?.stop();
  }

  /**
   * 停止并且删除任务 by id
   * @param {*} taskId
   */
  stopDeleteTaskById(taskId) {
    const { activeCronTasks } = this;
    const task = activeCronTasks[taskId];
    if (!task) {
      console.error(`${taskId} Task not found`);
      return;
    }
    task.stop();
    delete activeCronTasks[taskId];
  }

  /**
   * 根据 id 重启任务
   * @param {*} taskId
   */
  restartTaskById(taskId) {
    const { activeCronTasks } = this;
    const task = activeCronTasks[taskId];
    if (!task) {
      console.error(`${taskId} Task not found`);
      return;
    }
    task.stop();
    task.start();
  }

  /**
   *
   * @param {*} taskId
   */
  startTaskById(taskId) {
    const { activeCronTasks } = this;
    const task = activeCronTasks[taskId];
    if (!task) {
      console.error(`${taskId} Task not found`);
      return;
    }
    task.start();
  }
}

export const cronTask = new CronTask();
