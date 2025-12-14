// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { LoginForm } from "@/components/login-form";
// import { useAuthStore } from "@/stores/auth-store";

// export default function Home() {
//   const router = useRouter();
//   const { currentUser, restoreSession } = useAuthStore();

//   const [checking, setChecking] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [mounted, setMounted] = useState(false); // Track if on client

//   //  Set mounted true once client-side rendering is confirmed
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   //  Mobile detection (only after mount)
//   useEffect(() => {
//     if (!mounted) return;

//     const isMobileDevice = /iPhone|iPad|iPod|Android|Mobile/i.test(
//       navigator.userAgent
//     );
//     setIsMobile(isMobileDevice);
//   }, [mounted]);

//   useEffect(() => {
//     const checkSession = async () => {
//       await restoreSession(); // Restore user session
//       setChecking(false);
//     };

//     if (mounted && !isMobile) {
//       checkSession();
//     }
//   }, [restoreSession, mounted, isMobile]);

//   useEffect(() => {
//     if (
//       currentUser?.role === "superadmin" ||
//       currentUser?.role === "admin" ||
//       currentUser?.role === "user"
//     ) {
//       router.replace("/dashboard");
//     }
//   }, [currentUser, router]);

//   //  Don't render anything until client is mounted
//   if (!mounted) return null;

//   //  Block mobile access
//   if (isMobile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
//         <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
//           <h1 className="text-2xl font-bold text-red-500 mb-4">
//             Mobile Not Supported
//           </h1>
//           <p className="text-gray-700 mb-6">
//             This application is designed for desktop use only. Please open it on
//             a desktop or laptop browser.
//           </p>
//           {/* <img
//             src="/no-mobile.svg"
//             alt="No Mobile Support"
//             className="mx-auto w-32 h-32 opacity-80"
//           /> */}
//         </div>
//       </div>
//     );
//   }

//   //  While checking session
//   if (checking) {
//     return <div className="text-center py-20 text-gray-500">Loading...</div>;
//   }

//   //  If already logged in
//   if (
//     currentUser?.role === "superadmin" ||
//     currentUser?.role === "admin" ||
//     currentUser?.role === "user"
//   ) {
//     return null;
//   }

//   return <LoginForm />;
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const router = useRouter();
  const { currentUser, restoreSession } = useAuthStore();

  const [checking, setChecking] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    👉 strongest & safest mobile detect:

    - real mobile UA
    - mobile pointer style (hover:none & pointer:coarse)
    - laptop touch allowed
  */
  useEffect(() => {
    if (!mounted) return;

    const ua = navigator.userAgent.toLowerCase();
    const mobileUA = /android|iphone|mobile/i.test(ua);

    // mobile pointer behavior—even if Chrome desktop mode
    const mobilePointer = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const mobile = mobileUA || mobilePointer;
    setIsMobile(mobile);
  }, [mounted]);

  // session restore if desktop
  useEffect(() => {
    const checkSession = async () => {
      await restoreSession();
      setChecking(false);
    };

    if (mounted && !isMobile) {
      checkSession();
    }
  }, [restoreSession, mounted, isMobile]);

  // redirect if already logged in
  useEffect(() => {
    if (
      currentUser?.role === "superadmin" ||
      currentUser?.role === "admin" ||
      currentUser?.role === "user"
    ) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!mounted) return null;

  // block mobile & mobile desktop mode
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Mobile Not Supported
          </h1>
          <p className="text-gray-700 mb-6">
            Please open this app on a desktop or laptop browser only.
          </p>
        </div>
      </div>
    );
  }

  if (checking) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (
    currentUser?.role === "superadmin" ||
    currentUser?.role === "admin" ||
    currentUser?.role === "user"
  ) {
    return null;
  }


  //  If not logged in, show login form

  return <LoginForm />;
}







