"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CookieConsent from "@/components/CookieConsent/CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function ExternalScripts({
  nonce,
  cookieSettings,
}: {
  nonce: string;
  cookieSettings: any;
}) {
  const cookieConsent = Cookies.get("cookieConsent") === "true";
  const [hasMounted, setHasMounted] = useState(false);
  const [didAccept, setDidAccept] = useState(cookieConsent);

  const userAccepted = () => {
    setDidAccept(true);
  };

  useEffect(() => {
    setHasMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: client-only rendering to avoid hydration mismatch
  }, []);

  if (!hasMounted) return;

  return (
    <>
      {didAccept ? (
        <>
          {GA_ID && (
            <>
              <Script
                nonce={nonce}
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="lazyOnload"
              />
              <Script nonce={nonce} id="google-analytics" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
              </Script>
            </>
          )}
        </>
      ) : (
        <CookieConsent
          userAccepted={userAccepted}
          cookieSettings={cookieSettings}
        />
      )}
    </>
  );
}
