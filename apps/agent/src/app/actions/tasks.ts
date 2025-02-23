import { unstable_cache } from "next/cache";
import { createApiClient, HttpMethods } from "../server";
import { Task } from "@/lib/db/schema"; // adjust import path as needed

export type CreateTaskDto = {
  taskTypeId: string;
  growId: string;
  userId?: string; // typically set by server, but can pass in
  notes?: string;
  details?: Record<string, any>;
  images?: Record<string, any>[];
};
export type UpdateTaskDto = Partial<CreateTaskDto>;

export async function fetchTasksByGrow(growId: string): Promise<Task[]> {
  const apiClient = await createApiClient();
  return unstable_cache(
    async () => {
      return apiClient<Task[]>(`/api/tasks?growId=${growId}`, HttpMethods.GET);
    },
    [`tasks-by-grow-${growId}`],
    { tags: [`grow-${growId}`, "tasks"], revalidate: 30 } // cache for 30 seconds
  )();
}

export async function fetchTaskById(taskId: string): Promise<Task> {
  const apiClient = await createApiClient();
  return apiClient<Task>(`/api/tasks?taskId=${taskId}`, HttpMethods.GET);
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
  const apiClient = await createApiClient();
  return apiClient<Task, CreateTaskDto>(
    `/api/tasks`,
    HttpMethods.POST,
    undefined,
    data
  );
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskDto
): Promise<Task> {
  const apiClient = await createApiClient();
  return apiClient<Task, UpdateTaskDto>(
    `/api/tasks?taskId=${taskId}`,
    HttpMethods.PATCH,
    undefined,
    data
  );
}

export async function deleteTask(taskId: string): Promise<Task> {
  const apiClient = await createApiClient();
  return apiClient<Task>(`/api/tasks?taskId=${taskId}`, HttpMethods.DELETE);
}
