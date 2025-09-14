"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // 🛡️ Force user-select: none, even if browser extension overrides it
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
        enforceStyles(); // Re-apply if styles are overridden
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }, []);

    return (
      <div className="relative w-full">
        {/* 🕳️ Honeypot input to confuse bots/extensions */}
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
          onDragStart={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          onBeforeInput={(e) => {
            if (
              e instanceof InputEvent &&
              [
                "insertFromPaste",
                "insertFromPasteAsQuotation",
                "insertFromDrop",
              ].includes(e.inputType)
            ) {
              e.preventDefault();
            }
          }}
          onKeyDown={(e) => {
            const k = e.key.toLowerCase();
            const ctrlOrCmd = e.ctrlKey || e.metaKey;

            // Standard copy/paste/cut/select-all
            if (ctrlOrCmd && ["c", "v", "x", "a"].includes(k)) {
              e.preventDefault();
              return;
            }
            // Legacy combos
            if (
              (e.shiftKey && k === "insert") || // paste
              (e.ctrlKey && k === "insert") || // copy
              (e.shiftKey && k === "delete") // cut
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
