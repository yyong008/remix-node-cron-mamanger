import { ActionFunctionArgs } from "@remix-run/node";
import prisma from "~/lib/prisma";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const data = await request.json();
  const { id } = data;
  context.stopTaskById(id);
  const task = await prisma.task.update({
    where: { id },
    data: { status: "INACTIVE" },
  });
  return new Response(JSON.stringify(task), { status: 200 });
}
