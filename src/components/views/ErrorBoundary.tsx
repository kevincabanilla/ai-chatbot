import { isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorBoundary() {
  const isProd = import.meta.env.PROD;
  const error = useRouteError();

  return (
    <div className="h-screen p-20 flex flex-col text-center justify-center gap-4">
      <h1 className="text-xl md:text-2xl text-rose-600">
        Something went wrong
      </h1>

      <p className="md:text-lg">
        Sorry for the inconvenience. Try refreshing the page to continue or
        comeback later.
      </p>

      {!isProd && (
        <div className="p-8 rounded-md border border-white/30 text-start">
          <strong className="text-rose-600 text-xl">
            Error Details (Development Only)
          </strong>
          {isRouteErrorResponse(error) ? (
            <>
              <h1 className="text-rose-500 text-lg">Type: Route</h1>
              <h2>Status: {error.status}</h2>
              <p>{error.statusText}</p>
              {error.data && <p>{error.data}</p>}
            </>
          ) : (
            <>
              <h1 className="text-rose-400 text-lg">Type: Component</h1>
              <p>
                Message:&nbsp;
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>
              <details>
                <summary>Stack trace</summary>
                <pre>{(error as Error).stack}</pre>
              </details>
            </>
          )}
        </div>
      )}
      <div>
        <button
          className="cursor-pointer py-2.5 px-4 rounded-md font-bold uppercase text-sm md:text-base text-accent/80 hover:text-accent bg-white/6 hover:bg-accent/15"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
