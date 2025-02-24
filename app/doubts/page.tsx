import React from "react";

const Page = () => {
  return (
    <div className="h-[calc(100vh-64px)] overflow-auto flex flex-col gap-5 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <span className="text-3xl font-semibold">404 Not found;</span>
      <span className="text-sm font-semibold text-muted-foreground">kidding, This feature is coming soon...   😀</span>
    </div>
  );
};

export default Page;
