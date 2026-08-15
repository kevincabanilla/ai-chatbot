import { useState } from "react";
import clsx from "clsx";
import { useStore } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import AppButton from "../buttons/AppButton";
import { AppCard } from "../containers/AppCard";

export const SearchDialog = ({ onClose, ...props }: DialogProps) => {
  const { state, setState } = useStore();
  const [searchVal, setSearchVal] = useState("");

  const results = state.conversationOrder
    .map((key) => state.conversationsById[key])
    .filter((x) => x.messages.some((m) => m.content.includes(searchVal)));

  const closeDialog = () => {
    setSearchVal("");
    onClose();
  };

  const onSelectConversation = (id: string) => {
    setState((prev) => ({
      ...prev,
      currentConversationId: id,
    }));
    closeDialog();
  };

  return (
    <AppDialog size="lg" onClose={closeDialog} {...props}>
      <div className="flex flex-col gap-6 p-6">
        <div className="text-xl">
          <h1>Search</h1>
        </div>

        <div className="grow flex flex-col gap-3">
          {/* Search textbar */}
          <div className="flex flex-col gap-1">
            <input
              autoFocus
              placeholder="What do you want to search?"
              className={clsx(
                "block w-full rounded-lg border border-accent/40 bg-bg-secondary px-4 py-3 text-sm",
                "placeholder:text-gray-400",
                "outline-none",
                "transition",
                "hover:border-accent/60",
                "focus:border-accent",
                "focus:ring-4 focus:ring-blue-500/10",
                "disabled:cursor-not-allowed disabled:bg-gray-100",
              )}
              value={searchVal}
              onChange={(e) => {
                const inputValue = e.target.value;
                setSearchVal(inputValue);
              }}
            />
          </div>

          {/* Result list */}
          {searchVal && (
            <div className="flex flex-col gap-1">
              <div className="max-h-64 overflow-y-auto">
                {results.length > 0 ? (
                  <>
                    <span className="text-accent">Results:</span>
                    {results.map((x) => (
                      <AppCard
                        key={x.id}
                        className="rounded-md p-3 my-3 cursor-pointer"
                        onClick={() => {
                          onSelectConversation(x.id);
                        }}
                      >
                        {x.title}
                      </AppCard>
                    ))}
                  </>
                ) : (
                  <div className="mt-5 italic text-center text-white/60">
                    <h2>No results.</h2>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <AppButton
            variant="ghost"
            className="text-rose-500/90 bg-rose-500/2 hover:text-rose-500 hover:bg-rose-500/5"
            onClick={closeDialog}
          >
            Close
          </AppButton>
        </div>
      </div>
    </AppDialog>
  );
};
