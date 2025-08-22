// // import * as React from "react";
// // import { cn } from "@/lib/utils";

// // const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
// //   ({ className, type, name, ...props }, ref) => {
// //     return (
// //       <input
// //         autoComplete="new-password"
// //         name={Math.random().toString(36).substring(2, 10)}
// //         type={type}
// //         ref={ref}
// //         onCopy={(e) => e.preventDefault()}
// //         onPaste={(e) => e.preventDefault()}
// //         onCut={(e) => e.preventDefault()}
// //         onDrop={(e) => e.preventDefault()}
// //         onKeyDown={(e) => {
// //           if (
// //             (e.ctrlKey || e.metaKey) &&
// //             ["c", "v", "x"].includes(e.key.toLowerCase())
// //           ) {
// //             e.preventDefault();
// //           }
// //         }}
// //         style={{ imeMode: "disabled" }}
// //         className={cn(
// //           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
// //           className
// //         )}
// //         {...props}
// //       />
// //     );
// //   }
// // );
// // Input.displayName = "Input";

// // export { Input };
// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     const inputRef = React.useRef<HTMLInputElement | null>(null);

//     // MutationObserver to reapply user-select:none !important
//     React.useEffect(() => {
//       const input = inputRef.current;
//       if (!input) return;

//       const enforceStyles = () => {
//         input.style.setProperty("user-select", "none", "important");
//         input.style.setProperty("-webkit-user-select", "none", "important");
//         input.style.setProperty("-moz-user-select", "none", "important");
//         input.style.setProperty("-ms-user-select", "none", "important");
//       };

//       enforceStyles();

//       const observer = new MutationObserver(() => {
//         enforceStyles();
//       });

//       observer.observe(document.head, {
//         childList: true,
//         subtree: true,
//       });

//       return () => observer.disconnect();
//     }, []);

//     return (
//       <input
//         ref={(el) => {
//           inputRef.current = el;
//           if (typeof ref === "function") ref(el);
//           else if (ref) ref.current = el;
//         }}
//         name={
//           typeof crypto !== "undefined"
//             ? crypto.randomUUID()
//             : "input-" + Date.now()
//         }
//         type={type}
//         autoComplete="new-password"
//         onCopy={(e) => e.preventDefault()}
//         onPaste={(e) => e.preventDefault()}
//         onCut={(e) => e.preventDefault()}
//         onDrop={(e) => e.preventDefault()}
//         onContextMenu={(e) => e.preventDefault()}
//         onKeyDown={(e) => {
//           if (
//             (e.ctrlKey || e.metaKey) &&
//             ["c", "v", "x", "a"].includes(e.key.toLowerCase())
//           ) {
//             e.preventDefault();
//           }
//         }}
//         className={cn(
//           "secure-input no-user-select flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           className
//         )}
//         {...props}
//       />
//     );
//   }
// );
// Input.displayName = "Input";

// export { Input };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Force user-select: none !important (even if extension overrides it)
    React.useEffect(() => {
      const input = inputRef.current;
      if (!input) return;

      const enforceStyles = () => {
        input.style.setProperty("user-select", "none", "important");
        input.style.setProperty("-webkit-user-select", "none", "important");
        input.style.setProperty("-moz-user-select", "none", "important");
        input.style.setProperty("-ms-user-select", "none", "important");
      };

      enforceStyles();

      const observer = new MutationObserver(() => {
        enforceStyles();
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }, []);

    return (
      <div className="relative w-full">
        {/* Honeypot field to trap bots or extensions */}
        <input
          tabIndex={-1}
          autoComplete="off"
          className="absolute -z-10 h-0 w-0 opacity-0"
          name="honeypot"
        />

        <input
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          name={
            typeof crypto !== "undefined"
              ? crypto.randomUUID()
              : "input-" + Date.now()
          }
          type={type}
          autoComplete="new-password"
          onCopy={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (
              (e.ctrlKey || e.metaKey) &&
              ["c", "v", "x", "a"].includes(e.key.toLowerCase())
            ) {
              e.preventDefault();
            }
          }}
          className={cn(
            "secure-input no-user-select flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
