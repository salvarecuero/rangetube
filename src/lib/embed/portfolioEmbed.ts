// Announces readiness to the embedding portfolio and answers its hello/ack.
// Protocol version 1; must match the portfolio's embed controller.
import { PORTFOLIO_ORIGINS } from "./origins";

const PARENTS: readonly string[] = PORTFOLIO_ORIGINS;
const V = 1;

interface EmbedMessage {
  type?: string;
  v?: number;
}

export function startPortfolioReady(): void {
  if (window.parent === window) return; // not embedded; no-op
  let acked = false;
  let tries = 0;

  function announce(): void {
    if (acked || tries++ >= 10) return;
    for (const origin of PARENTS) {
      try {
        window.parent.postMessage({ type: "portfolio:ready", v: V }, origin);
      } catch {
        /* origin not allowed by this parent; ignore */
      }
    }
    setTimeout(announce, 250);
  }

  window.addEventListener("message", (e: MessageEvent<EmbedMessage>) => {
    if (!PARENTS.includes(e.origin)) return;
    if (e.data?.type === "portfolio:ack" && e.data?.v === V) acked = true;
    if (e.data?.type === "portfolio:hello" && e.data?.v === V) announce();
  });

  announce();
}
