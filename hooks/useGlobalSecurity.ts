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
"use client";
import { useEffect } from "react";

export function useGlobalSecurity() {
  useEffect(() => {
    const blockEvent = (e: Event) => e.stopImmediatePropagation(); // ⛔ even extensions can't skip this
    const blockKeyEvent = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a"].includes(e.key.toLowerCase())
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    // 🔐 Force user-select: none globally (defeat extension style)
    const forceNoSelect = () => {
      document.querySelectorAll<HTMLElement>("*").forEach((el) => {
        el.style.setProperty("user-select", "none", "important");
        el.style.setProperty("-webkit-user-select", "none", "important");
        el.style.setProperty("-moz-user-select", "none", "important");
        el.style.setProperty("-ms-user-select", "none", "important");
      });
    };

    // 🧹 Remove style tags added by the extension
    const removeInjectedStyles = () => {
      document.querySelectorAll("style").forEach((styleTag) => {
        if (
          styleTag.innerText.includes("user-select: text") ||
          styleTag.innerText.includes("context-menu") ||
          styleTag.innerText.includes("right-click")
        ) {
          styleTag.remove(); // 🗑️ Extension styles gone
        }
      });
    };

    // ⏱️ Re-apply every 800ms
    const interval = setInterval(() => {
      forceNoSelect();
      removeInjectedStyles();
    }, 800);

    // 👀 Watch for new injected styles
    const observer = new MutationObserver(() => {
      forceNoSelect();
      removeInjectedStyles();
    });

    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });

    // 🔒 Event blockers
    document.addEventListener("copy", blockEvent, true);
    document.addEventListener("paste", blockEvent, true);
    document.addEventListener("cut", blockEvent, true);
    document.addEventListener("contextmenu", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);
    document.addEventListener("drop", blockEvent, true);
    document.addEventListener("keydown", blockKeyEvent, true);

    // Initial call
    forceNoSelect();
    removeInjectedStyles();

    return () => {
      clearInterval(interval);
      observer.disconnect();
      document.removeEventListener("copy", blockEvent, true);
      document.removeEventListener("paste", blockEvent, true);
      document.removeEventListener("cut", blockEvent, true);
      document.removeEventListener("contextmenu", blockEvent, true);
      document.removeEventListener("dragstart", blockEvent, true);
      document.removeEventListener("drop", blockEvent, true);
      document.removeEventListener("keydown", blockKeyEvent, true);
    };
  }, []);
}
