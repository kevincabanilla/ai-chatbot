import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";
import { useTypingAnimation } from "@/hooks";
import { PromptTextArea } from "../ui/PromptTextArea";

export const MainView = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));

  return (
    <main>
      <div className="relative min-h-screen p-6 flex justify-center items-center">
        <div className="w-full md:w-auto">
          <div className="text-center p-5">
            <h1 className="text-lg md:text-3xl">{greeting}</h1>
          </div>

          <PromptTextArea
            onSubmit={(v) => {
              console.log(v);
            }}
          />
        </div>
      </div>
    </main>
  );
};
