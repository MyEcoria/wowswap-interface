import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

import {Swap} from "@/components/swap";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Crypto Exchange&nbsp;</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Free from sign-up, limits, complications
        </h2>
      </div>

      <div className="flex gap-3">
        <Swap/>
      </div>
    </section>
  );
}
