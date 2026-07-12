import { AppCard } from "../containers/AppCard";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";
import { useTypingAnimation } from "@/hooks";

export const MainContainer = () => {
  const greeting = useTypingAnimation(Helper.pickRandom(GREETINGS));

  return (
    <main>
      <div className="relative min-h-screen p-6 flex justify-center items-center">
        <div className="w-full md:w-auto">
          <div className="text-center p-5">
            <h1 className="text-lg md:text-3xl">{greeting}</h1>
          </div>

          <AppCard className="p-4">
          </AppCard>
        </div>
      </div>
    </main>
  );
};
