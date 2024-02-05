import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="flex-flex-col relative w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded resize-none py-3 pr-12 text-base"
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus={!isDisabled}
                disabled={isDisabled}
              />
              <Button
                aria-label="send message"
                className="absolute bottom-[0.3rem] right-[8px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
