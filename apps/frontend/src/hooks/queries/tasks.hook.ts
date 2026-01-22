import { queryOptions, useQuery } from "@tanstack/react-query";
import { type GetTasksQueryParams, getTasks } from "../../libs/api/Tasks";

export const tasksOptions = (queryParams: GetTasksQueryParams) =>
  queryOptions({
    queryKey: ["tasks", queryParams],
    queryFn: () => getTasks(queryParams),
  });

export const useTasks = (queryParams: GetTasksQueryParams) => {
  return useQuery(tasksOptions(queryParams));
};
