import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { TaskList } from "@/components/TaskList";
import { tasksOptions } from "@/hooks/queries/tasks.hook";
import { getQueryClient } from "@/libs/tanstackQuery";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    tasksOptions({
      limit: "10",
      offset: "0",
    }),
  );

  return (
    <main>
      <h1>Tasks</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TaskList />
      </HydrationBoundary>
    </main>
  );
}
