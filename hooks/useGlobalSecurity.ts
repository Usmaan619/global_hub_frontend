// // // hooks/useGlobalSecurity.ts
// // import { useEffect } from "react";

// // export function useGlobalSecurity() {
// //   useEffect(() => {
// //     const blockEvent = (e: Event) => e.preventDefault();
// //     const blockKeys = (e: KeyboardEvent) => {
// //       if (
// //         (e.ctrlKey || e.metaKey) &&
// //         ["c", "v", "x", "a"].includes(e.key.toLowerCase())
// //       ) {
// //         e.preventDefault();
// //       }
// //     };

// //     const reApplyUserSelectNone = () => {
// //       document.querySelectorAll("*").forEach((el) => {
// //         (el as HTMLElement).style.setProperty(
// //           "user-select",
// //           "none",
// //           "important"
// //         );
// //         (el as HTMLElement).style.setProperty(
// //           "-webkit-user-select",
// //           "none",
// //           "important"
// //         );
// //       });
// //     };

// //     reApplyUserSelectNone();

// //     const observer = new MutationObserver(() => {
// //       reApplyUserSelectNone();
// //     });

// //     observer.observe(document.head, { childList: true, subtree: true });

// //     document.addEventListener("copy", blockEvent);
// //     document.addEventListener("paste", blockEvent);
// //     document.addEventListener("cut", blockEvent);
// //     document.addEventListener("contextmenu", blockEvent);
// //     document.addEventListener("keydown", blockKeys);
// //     document.addEventListener("dragstart", blockEvent);
// //     document.addEventListener("drop", blockEvent);

// //     return () => {
// //       observer.disconnect();
// //       document.removeEventListener("copy", blockEvent);
// //       document.removeEventListener("paste", blockEvent);
// //       document.removeEventListener("cut", blockEvent);
// //       document.removeEventListener("contextmenu", blockEvent);
// //       document.removeEventListener("keydown", blockKeys);
// //       document.removeEventListener("dragstart", blockEvent);
// //       document.removeEventListener("drop", blockEvent);
// //     };
// //   }, []);
// // }
// "use client";
// import { useEffect } from "react";

// export function useGlobalSecurity() {
//   useEffect(() => {
//     const applySecurity = () => {
//       document.querySelectorAll<HTMLElement>("*").forEach((el) => {
//         el.style.setProperty("user-select", "none", "important");
//         el.style.setProperty("-webkit-user-select", "none", "important");
//         el.style.setProperty("-moz-user-select", "none", "important");
//         el.style.setProperty("-ms-user-select", "none", "important");
//       });
//     };

//     const blockEvent = (e: Event) => e.preventDefault();

//     const blockKeys = (e: KeyboardEvent) => {
//       if (
//         (e.ctrlKey || e.metaKey) &&
//         ["c", "v", "x", "a"].includes(e.key.toLowerCase())
//       ) {
//         e.preventDefault();
//       }
//     };

//     // 🌀 Repeat every 1s — enforce again and again
//     const interval = setInterval(() => {
//       applySecurity();
//     }, 1000);

//     // 👀 Monitor head and body — extensions inject styles here
//     const observer = new MutationObserver(() => {
//       applySecurity();
//     });

//     observer.observe(document.head, { childList: true, subtree: true });
//     observer.observe(document.body, { childList: true, subtree: true });

//     // Block basic user actions
//     document.addEventListener("copy", blockEvent);
//     document.addEventListener("paste", blockEvent);
//     document.addEventListener("cut", blockEvent);
//     document.addEventListener("contextmenu", blockEvent);
//     document.addEventListener("dragstart", blockEvent);
//     document.addEventListener("drop", blockEvent);
//     document.addEventListener("keydown", blockKeys);

//     // Initial call
//     applySecurity();

//     return () => {
//       clearInterval(interval);
//       observer.disconnect();
//       document.removeEventListener("copy", blockEvent);
//       document.removeEventListener("paste", blockEvent);
//       document.removeEventListener("cut", blockEvent);
//       document.removeEventListener("contextmenu", blockEvent);
//       document.removeEventListener("dragstart", blockEvent);
//       document.removeEventListener("drop", blockEvent);
//       document.removeEventListener("keydown", blockKeys);
//     };
//   }, []);
// }
// "use client";
// import { useEffect } from "react";

// export function useGlobalSecurity() {
//   useEffect(() => {
//     const blockEvent = (e: Event) => e.stopImmediatePropagation(); // ⛔ even extensions can't skip this
//     const blockKeyEvent = (e: KeyboardEvent) => {
//       if (
//         (e.ctrlKey || e.metaKey) &&
//         ["c", "v", "x", "a"].includes(e.key.toLowerCase())
//       ) {
//         e.stopImmediatePropagation();
//         e.preventDefault();
//       }
//     };

//     // 🔐 Force user-select: none globally (defeat extension style)
//     const forceNoSelect = () => {
//       document.querySelectorAll<HTMLElement>("*").forEach((el) => {
//         el.style.setProperty("user-select", "none", "important");
//         el.style.setProperty("-webkit-user-select", "none", "important");
//         el.style.setProperty("-moz-user-select", "none", "important");
//         el.style.setProperty("-ms-user-select", "none", "important");
//       });
//     };

//     // 🧹 Remove style tags added by the extension
//     const removeInjectedStyles = () => {
//       document.querySelectorAll("style").forEach((styleTag) => {
//         if (
//           styleTag.innerText.includes("user-select: text") ||
//           styleTag.innerText.includes("context-menu") ||
//           styleTag.innerText.includes("right-click")
//         ) {
//           styleTag.remove(); // 🗑️ Extension styles gone
//         }
//       });
//     };

//     // ⏱️ Re-apply every 800ms
//     const interval = setInterval(() => {
//       forceNoSelect();
//       removeInjectedStyles();
//     }, 800);

//     // 👀 Watch for new injected styles
//     const observer = new MutationObserver(() => {
//       forceNoSelect();
//       removeInjectedStyles();
//     });

//     observer.observe(document.head, { childList: true, subtree: true });
//     observer.observe(document.body, { childList: true, subtree: true });

//     // 🔒 Event blockers
//     document.addEventListener("copy", blockEvent, true);
//     document.addEventListener("paste", blockEvent, true);
//     document.addEventListener("cut", blockEvent, true);
//     document.addEventListener("contextmenu", blockEvent, true);
//     document.addEventListener("dragstart", blockEvent, true);
//     document.addEventListener("drop", blockEvent, true);
//     document.addEventListener("keydown", blockKeyEvent, true);

//     // Initial call
//     forceNoSelect();
//     removeInjectedStyles();

//     return () => {
//       clearInterval(interval);
//       observer.disconnect();
//       document.removeEventListener("copy", blockEvent, true);
//       document.removeEventListener("paste", blockEvent, true);
//       document.removeEventListener("cut", blockEvent, true);
//       document.removeEventListener("contextmenu", blockEvent, true);
//       document.removeEventListener("dragstart", blockEvent, true);
//       document.removeEventListener("drop", blockEvent, true);
//       document.removeEventListener("keydown", blockKeyEvent, true);
//     };
//   }, []);
// }
// "use client";
// import { useEffect } from "react";

// type Options = {
//   secureRootSelector?: string; // default: [data-secure-root]
//   intervalMs?: number; // default: 0 (disabled)
//   allowAttrSelect?: string; // default: data-allow-select
//   allowAttrClipboard?: string; // default: data-allow-clipboard
//   blockDevShortcuts?: boolean; // default: true (Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+P)
// };

// export function useGlobalSecurity(opts?: Options) {
//   const {
//     secureRootSelector = "[data-secure-root]",
//     intervalMs = 800,
//     allowAttrSelect = "data-allow-select",
//     allowAttrClipboard = "data-allow-clipboard",
//     blockDevShortcuts = true,
//   } = opts || {};

//   useEffect(() => {
//     const root = document.querySelector<HTMLElement>(secureRootSelector);
//     if (!root) return;

//     // Inject a baseline stylesheet (cheaper than hammering inline styles)
//     const style = document.createElement("style");
//     style.setAttribute("data-origin", "secure");
//     style.textContent = `
//       ${secureRootSelector} * {
//         -webkit-user-select: none !important;
//         user-select: none !important;
//       }
//       ${secureRootSelector} img {
//         -webkit-user-drag: none;
//         user-drag: none;
//       }
//       ${secureRootSelector} [${allowAttrSelect}] {
//         -webkit-user-select: text !important;
//         user-select: text !important;
//       }
//     `;
//     document.head.appendChild(style);

//     const hasAttrUp = (node: Node | null, attr: string) => {
//       let n: Node | null = node;
//       while (n && n instanceof HTMLElement) {
//         if (n.hasAttribute(attr)) return true;
//         n = n.parentElement;
//       }
//       return false;
//     };

//     const inSecureRoot = (target: EventTarget | null) =>
//       target instanceof Node && root.contains(target);

//     // Inline reinforcement only where needed (defense-in-depth)
//     const forceNoSelect = () => {
//       const nodes = root.querySelectorAll<HTMLElement>("*");
//       nodes.forEach((el) => {
//         if (!el.closest(`[${allowAttrSelect}]`)) {
//           el.style.setProperty("user-select", "none", "important");
//           el.style.setProperty("-webkit-user-select", "none", "important");
//         }
//       });
//     };

//     const blockEvent = (e: Event) => {
//       if (!inSecureRoot(e.target)) return;
//       if (hasAttrUp(e.target as Node, allowAttrClipboard)) return;
//       e.stopImmediatePropagation();
//       e.preventDefault();
//     };

//     const blockKeyEvent = (e: KeyboardEvent) => {
//       if (!inSecureRoot(e.target)) return;
//       if (hasAttrUp(e.target as Node, allowAttrClipboard)) return;

//       const k = e.key.toLowerCase();
//       const ctrlOrCmd = e.ctrlKey || e.metaKey;

//       const blockCombos = [
//         ctrlOrCmd && ["c", "v", "x", "a"].includes(k), // copy/paste/cut/select-all
//         e.shiftKey && k === "insert", // paste (legacy)
//         e.ctrlKey && k === "insert", // copy (legacy)
//         e.shiftKey && k === "delete", // cut  (legacy)
//       ];

//       const devCombos = blockDevShortcuts
//         ? [
//             ctrlOrCmd && ["p", "u"].includes(k), // print, view-source
//             ctrlOrCmd && e.shiftKey && ["i", "j", "c"].includes(k), // devtools variants
//           ]
//         : [];

//       if ([...blockCombos, ...devCombos].some(Boolean)) {
//         e.stopImmediatePropagation();
//         e.preventDefault();
//       }
//     };

//     // Mutation observer with batching
//     let rafId = 0;
//     const schedule = (fn: () => void) => {
//       cancelAnimationFrame(rafId);
//       rafId = requestAnimationFrame(fn);
//     };
//     const observer = new MutationObserver(() => {
//       schedule(forceNoSelect);
//     });

//     observer.observe(root, {
//       childList: true,
//       subtree: true,
//       attributes: true,
//     });

//     // Event blockers (capture phase)
//     document.addEventListener("copy", blockEvent, true);
//     document.addEventListener("paste", blockEvent, true);
//     document.addEventListener("cut", blockEvent, true);
//     document.addEventListener("contextmenu", blockEvent, true);
//     document.addEventListener("dragstart", blockEvent, true);
//     document.addEventListener("drop", blockEvent, true);
//     document.addEventListener("keydown", blockKeyEvent, true);

//     // Optional periodic hardening
//     const intervalId =
//       intervalMs > 0 ? window.setInterval(forceNoSelect, intervalMs) : 0;

//     // Initial enforce
//     forceNoSelect();

//     return () => {
//       observer.disconnect();
//       cancelAnimationFrame(rafId);
//       if (intervalId) window.clearInterval(intervalId);
//       document.removeEventListener("copy", blockEvent, true);
//       document.removeEventListener("paste", blockEvent, true);
//       document.removeEventListener("cut", blockEvent, true);
//       document.removeEventListener("contextmenu", blockEvent, true);
//       document.removeEventListener("dragstart", blockEvent, true);
//       document.removeEventListener("drop", blockEvent, true);
//       document.removeEventListener("keydown", blockKeyEvent, true);
//       style.remove();
//     };
//   }, [
//     secureRootSelector,
//     intervalMs,
//     allowAttrSelect,
//     allowAttrClipboard,
//     blockDevShortcuts,
//   ]);
// }
"use client";
import { useEffect } from "react";

export function useGlobalSecurity() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-secure-root]");
    if (!root) return;

    // 1) High-specificity stylesheet
    const style = document.createElement("style");
    style.setAttribute("data-origin", "secure");
    style.textContent = `
      [data-secure-root] *, html body [data-secure-root] * {
        -webkit-user-select: none !important;
        user-select: none !important;
      }
      [data-secure-root] [data-allow-select] {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    const inRoot = (t: EventTarget | null) => t instanceof Node && root.contains(t);

    // 2) Capture-phase blockers
    const block = (e: Event) => {
      if (!inRoot(e.target)) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    const keyBlock = (e: KeyboardEvent) => {
      if (!inRoot(e.target)) return;
      const k = e.key.toLowerCase();
      const cmd = e.ctrlKey || e.metaKey;
      if (
        (cmd && ["c","v","x","a","p","u"].includes(k)) ||
        (cmd && e.shiftKey && ["i","j","c"].includes(k)) ||
        (e.shiftKey && k === "insert") ||
        (e.ctrlKey && k === "insert") ||
        (e.shiftKey && k === "delete")
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    document.addEventListener("copy", block, true);
    document.addEventListener("cut", block, true);
    document.addEventListener("paste", block, true);
    document.addEventListener("contextmenu", block, true);
    document.addEventListener("dragstart", block, true);
    document.addEventListener("drop", block, true);
    document.addEventListener("keydown", keyBlock, true);

    // 3) Inline reinforce only inside secure root (light)
    const enforce = () => {
      root.querySelectorAll<HTMLElement>("*:not([data-allow-select])").forEach((el) => {
        el.style.setProperty("user-select", "none", "important");
        el.style.setProperty("-webkit-user-select", "none", "important");
      });
    };
    enforce();

    // 4) Observe secure root only
    const mo = new MutationObserver(() => {
      requestAnimationFrame(enforce);
    });
    mo.observe(root, { childList: true, subtree: true, attributes: true });

    return () => {
      mo.disconnect();
      document.removeEventListener("copy", block, true);
      document.removeEventListener("cut", block, true);
      document.removeEventListener("paste", block, true);
      document.removeEventListener("contextmenu", block, true);
      document.removeEventListener("dragstart", block, true);
      document.removeEventListener("drop", block, true);
      document.removeEventListener("keydown", keyBlock, true);
      style.remove();
    };
  }, []);
}
