"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { tasksOptions } from "../hooks/queries/tasks.hook";

export const TaskList = () => {
  const {
    data: { data, total },
  } = useSuspenseQuery(
    tasksOptions({
      limit: "10",
      offset: "0",
    }),
  );

  return (
    <div>
      <h1>Task List</h1>
      <p>Total Tasks: {total}</p>
      <ul>
        {data.map((task) => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
