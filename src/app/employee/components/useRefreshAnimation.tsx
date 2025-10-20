import { useGSAP } from "@gsap/react";
import { RefObject } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function useRefreshAnimation(
  ref: RefObject<HTMLDivElement | null>,
  route: string,
  auxiliarFunction?: () => void
) {
  const router = useRouter();
  const pathname = usePathname();
  useGSAP(
    (ctx) => {
      if (!ref.current) return;

      const p = ctx.selector?.("p"); // <- usa optional chaining
      if (!p) return; // <- garante que existe antes de animar

      const tl = gsap.timeline();
      tl.set(p, { opacity: 0 });
      tl.to(p, { opacity: 1, duration: 1 }, "+=0.6");
      tl.to(p, { opacity: 0, duration: 1 }, "+=1");
      tl.call(() => {
        if (pathname == route) {
          console.log("Passou por aqui no refresh");
          return window.location.reload();
        }

        if (auxiliarFunction) {
          auxiliarFunction();
          console.log("[ ==== USUÁRIO LIMPO ==== ]");
        }
        router.push(route);
      }, []);
    },
    { scope: ref }
  );
}
