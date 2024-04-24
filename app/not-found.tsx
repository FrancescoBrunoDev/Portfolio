import { Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 ">
        <Brain className="h-24 w-24 stroke-primary stroke-[2.5]" />
        <h2 className="text-center w-44 text-xl text-primary">
          Whether it's a happy accident or a testament to your brilliant mind
          (♥), care to return to the working portfolio?
        </h2>
        <Link href="/">
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  );
}
