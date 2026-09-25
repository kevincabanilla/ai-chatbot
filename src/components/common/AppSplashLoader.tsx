export const AppSplashLoader = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-sky-300" />
        <p className="text-sm text-white/55">Loading...</p>
      </div>
    </main>
  );
};
