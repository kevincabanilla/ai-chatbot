import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { QUERY_PARAM, useStore } from "@/hooks";
import { getMessageDate } from "@/libs/utils";
import { AppIconButton } from "@/components/buttons/AppIconButton";
import { AppTooltip } from "@/components/indicators/AppTooltip";
import {
  AppCombobox,
  type ComboboxOption,
} from "@/components/inputs/AppCombobox";

type SearchInType = "all" | "current";

const getMatchPreview = (content: string, query: string) => {
  const matchIndex = content
    .toLocaleLowerCase()
    .indexOf(query.toLocaleLowerCase());
  if (matchIndex < 0) return null;

  const start = Math.max(0, matchIndex - 48);
  const end = Math.min(content.length, matchIndex + query.length + 88);

  return {
    before: `${start > 0 ? "..." : ""}${content.slice(start, matchIndex)}`,
    match: content.slice(matchIndex, matchIndex + query.length),
    after: `${content.slice(matchIndex + query.length, end)}${end < content.length ? "..." : ""}`,
  };
};

export interface SearchComponentProps {
  currentConversationId?: string | null;
  onSelectItem: (conversationId: string) => void;
  onClose: () => void;
}

export const SearchComponent = ({
  currentConversationId,
  onSelectItem,
  onClose,
}: SearchComponentProps) => {
  const { state } = useStore();
  const [searchVal, setSearchVal] = useState("");
  const [searchIn, setSearchIn] = useState<SearchInType>("all");
  const searchTerm = searchVal.trim();

  const results = useMemo(() => {
    if (!searchTerm) return [];

    const source =
      searchIn === "current" && currentConversationId
        ? [
            state.conversationOrder.find(
              (id) => id === currentConversationId,
            ) ?? "",
          ]
        : state.conversationOrder;

    return source.flatMap((conversationId) => {
      const conversation = state.conversationsById[conversationId];

      return conversation.messages.flatMap((message) => {
        if (!message.messageId) return [];
        const preview = getMatchPreview(message.content, searchTerm);
        return preview
          ? [
              {
                conversation,
                message,
                preview,
                date: getMessageDate(message),
              },
            ]
          : [];
      });
    });
  }, [
    currentConversationId,
    searchIn,
    searchTerm,
    state.conversationOrder,
    state.conversationsById,
  ]);

  useEffect(() => {
    const resetSearchIn = () => {
      setSearchIn("all");
    };

    if (!currentConversationId && searchIn === "current") resetSearchIn();
  }, [currentConversationId, searchIn]);

  const searchInOptions = [
    { label: "All Conversations", value: "all" },
    {
      label: "Current Conversation",
      value: "current",
      disabled: !currentConversationId,
    },
  ] as ComboboxOption<SearchInType>[];

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Search size={18} aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold truncate">Search messages</h1>
        </div>
        <AppIconButton
          label="Close"
          variant="plain"
          className="hover:text-rose-600"
          icon={X}
          onClick={onClose}
        />
      </div>

      <div className="flex min-h-0 grow flex-col gap-4 p-5">
        <div className="relative flex shrink-0">
          <Search
            size={17}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            autoFocus
            aria-label="Search messages"
            placeholder="What do you want to search?"
            className={clsx(
              "block w-full rounded-xl border border-white/10 bg-bg-secondary py-3 pr-11 pl-10 text-sm",
              "placeholder:text-white/35 outline-none transition",
              "hover:border-white/20 focus:border-accent/70 focus:ring-4 focus:ring-accent/10",
            )}
            value={searchVal}
            onChange={(event) => {
              setSearchVal(event.target.value);
            }}
          />
          {searchVal && (
            <AppIconButton
              label="Clear search"
              variant="plain"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-white/55 hover:text-white"
              icon={X}
              onClick={() => {
                setSearchVal("");
              }}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-medium truncate">Find in</span>
          <div className="flex-1 sm:max-w-52">
            <AppCombobox
              value={searchIn}
              options={searchInOptions}
              placeholder="Search where?"
              aria-label="Where to Search"
              onValueChange={setSearchIn}
            />
          </div>
        </div>

        {searchTerm && (
          <div className="flex min-h-0 grow flex-col gap-2">
            <div className="flex items-center justify-between px-1 text-xs text-white/50">
              <span>Matching messages</span>
              <span>{results.length}</span>
            </div>
            <div className="app-scrollbar min-h-0 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                {results.length > 0 ? (
                  <motion.div
                    key={searchTerm}
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {results.map(
                      ({ conversation, message, preview, date }, index) => (
                        <motion.div
                          key={`${conversation.id}-${message.messageId}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.16,
                            delay: Math.min(index * 0.025, 0.2),
                          }}
                        >
                          <Link
                            className={clsx(
                              "group block rounded-xl border border-white/8 bg-white/2.5 p-3.5 transition-colors",
                              "hover:border-accent/35 hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-accent",
                            )}
                            to={`/?${QUERY_PARAM.ChatId}=${encodeURIComponent(conversation.id)}#${encodeURIComponent(message.messageId)}`}
                            onClick={() => {
                              onSelectItem(conversation.id);
                            }}
                          >
                            <div className="mb-1.5 flex min-w-0 items-center gap-2 text-xs">
                              <span className="truncate font-medium text-white/80">
                                {conversation.title}
                              </span>
                              <span className="shrink-0 rounded-md bg-white/7 px-1.5 py-0.5 text-white/50">
                                {message.role === "user" ? "You" : "Assistant"}
                              </span>
                              <span className="ml-auto flex shrink-0 items-center gap-2">
                                {date && (
                                  <AppTooltip
                                    arrow
                                    placement="left"
                                    title={format(date, "PPpp")}
                                  >
                                    <time
                                      dateTime={date.toISOString()}
                                      className="text-white/40 underline underline-offset-2 decoration-dotted"
                                    >
                                      {formatDistanceToNow(date, {
                                        addSuffix: true,
                                      })}
                                    </time>
                                  </AppTooltip>
                                )}
                                {conversation.id === currentConversationId && (
                                  <span className="rounded-md bg-accent/40 px-1.5 py-0.5 text-white/80">
                                    Current
                                  </span>
                                )}
                              </span>
                            </div>
                            <p className="line-clamp-3 text-sm leading-relaxed text-white/65 group-hover:text-white/85">
                              {preview.before}
                              <mark className="rounded-sm bg-accent/25 px-0.5 text-sky-100">
                                {preview.match}
                              </mark>
                              {preview.after}
                            </p>
                          </Link>
                        </motion.div>
                      ),
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2 py-10 text-center"
                  >
                    <Search
                      size={22}
                      className="text-white/30"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-white/65">
                      No matching messages
                    </p>
                    <p className="text-xs text-white/40">
                      Try a different phrase
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
