import { useState } from "react";
import { useStore } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import AppButton from "../buttons/AppButton";
import { AppCard } from "../containers/AppCard";

export const SearchDialog = ({ onClose, ...props }: DialogProps) => {
  const { state } = useStore();
  const [searchVal, setSearchVal] = useState("");

  const results = state.conversationOrder
    .map((key) => state.conversationsById[key])
    .filter((x) => x.messages.some((m) => m.content.includes(searchVal)));

  const closeDialog = () => {
    onClose();
  };

  return (
    <AppDialog onClose={closeDialog} {...props}>
      <div className="flex flex-col gap-6 p-6">
        <div className="text-xl">
          <h1>Search</h1>
        </div>

        <div className="grow flex flex-col gap-3">
          {/* Search textbar */}
          <div className="flex flex-col gap-1">
            <input
              autoFocus
              value={searchVal}
              onChange={(e) => {
                const inputValue = e.target.value;
                setSearchVal(inputValue);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  // search();
                }
              }}
            />
          </div>

          {/* Result list */}
          <div className="flex flex-col gap-1">
            <span className="text-accent">Results:</span>
            <div className="">
              {results.map((x) => (
                <>
                  <AppCard className="rounded-xl">{x.title}</AppCard>
                </>
              ))}

              {searchVal && results.length === 0 && (
                <div>
                  <span>No results.</span>
                </div>
              )}
            </div>
          </div>
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
