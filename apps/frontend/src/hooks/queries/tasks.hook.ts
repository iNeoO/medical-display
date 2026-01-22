import { queryOptions, useQuery } from "@tanstack/react-query";
import { type GetTasksQueryParams, getTasks } from "../../libs/api/Tasks";

export const tasksOptions = (queryParams: GetTasksQueryParams) =>
  queryOptions({
    queryKey: ["tasks", queryParams],
    queryFn: () => getTasks(queryParams),
    initialData: { data: [], total: 0 },
  });

export const useTasks = (queryParams: GetTasksQueryParams) => {
  return useQuery(tasksOptions(queryParams));
};
