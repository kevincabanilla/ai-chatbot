import { AppCard } from "./AppCard";
import { GREETINGS } from "@/constants/greetings";
import { Helper } from "@/utils";

export const MainContainer = () => {
  const greeting = Helper.pickRandom(GREETINGS);

  return (
    <main>
      <div className="relative min-h-screen flex justify-center items-center">
        <div className="max-w-3xl">
          <div className="text-center p-5">
            <h1 className="text-3xl">{greeting}</h1>
          </div>

        </div>
      </div>
    </main>
  );
};
