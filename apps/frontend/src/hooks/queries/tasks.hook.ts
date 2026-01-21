import { useQuery } from "@tanstack/react-query";
import { type GetTasksQueryParams, getTasks } from "../../libs/api/Tasks";

export const useTasks = (queryParams: GetTasksQueryParams) => {
	return useQuery({
		queryKey: ["tasks", queryParams],
		queryFn: () => getTasks(queryParams),
		initialData: { data: [], total: 0 },
	});
};
0;
