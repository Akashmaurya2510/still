import { Header } from "./Header";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";
import { ThemeSync } from "./ThemeSync";

export function App() {
  return (
    <>
      <ThemeSync />
      <div className="app-shell flex h-full w-full flex-col">
        <div className="app-frame mx-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-bg px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:px-5">
          <div className="flex min-h-0 flex-1 flex-col gap-5">
            <Header />
            <TaskInput />
            <TaskList />
          </div>
        </div>
      </div>
    </>
  );
}
