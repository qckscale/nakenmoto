"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.scss";
import { usePathname } from "next/navigation";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";
import { useMemo } from "react";

interface FooterProps {
  footer: {
    copyrightText: string;
    pagesOfInterest: {
      title: string;
      link: string;
      isCustomLink?: boolean;
    }[];
    name: string;
    address: string;
    phone: string;
    email: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  collections: any[];
}
export function Footer({ footer, collections }: FooterProps) {
  if (!footer) return null;
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  const defaultLinks = useMemo(
    () => [
      {
        title: translate("journal", locale),
        link: "news",
        isCustomLink: true,
      },
      {
        title: translate("contact", locale),
        link: "contact",
        isCustomLink: true,
      },
    ],
    [locale]
  );

  const halfIndex = useMemo(() => Math.ceil((collections || []).length / 2), [collections]);
  const firstHalf = useMemo(
    () => (collections || []).slice(0, halfIndex),
    [collections, halfIndex]
  );
  const secondHalf = useMemo(
    () => (collections || []).slice(halfIndex),
    [collections, halfIndex]
  );

  return (
    <>
      <footer className={styles.footer}>
        <div className={`${styles.footerContent} container-width d-flex w100`}>
          <div className={styles.footerItem}>
            <Image
              alt="NakenMoto"
              width={160}
              height={40}
              src="/logo.svg"
            />
          </div>
          <div className={styles.footerItem}>
            <h3>{translate("collections", locale)}</h3>
            <div className={`d-flex ${styles.footerDoubleLists} wrap`}>
              <ul>
                {firstHalf?.map((link: any) => (
                  <li key={`${link.slug}-${link.title}`}>
                    <Link href={i18Link(`shop?collection=${link.slug}`, locale)}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul>
                {secondHalf?.map((link: any) => (
                  <li key={`${link.slug}-${link.title}`}>
                    <Link href={i18Link(`shop?collection=${link.slug}`, locale)}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.footerItem}>
            <h3>NakenMoto</h3>
            <ul>
              {[...defaultLinks, ...footer.pagesOfInterest]?.map((link) => (
                <li key={`${link.link}-${link.title}`}>
                  <Link
                    href={`${i18Link(
                      link.isCustomLink ? `${link.link}` : `page/${link.link}`,
                      locale
                    )}`}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerItem}>
            <h3>{translate("contact", locale)}</h3>
            <div>
              <div className={styles.companyDetailItem}>{footer.phone}</div>
              <div className={styles.companyDetailItem}>{footer.address}</div>
              <div className={styles.companyDetailItem}>{footer.email}</div>
            </div>
          </div>
        </div>
      </footer>
      <div className={styles.copyright}>
        <div className="container-width">
          <div className={`${styles.copyrightContent} d-flex justify-between align-center`}>
            {footer.copyrightText}

            <div className={styles.socialIcons}>
              {footer.instagram && (
                <a href={footer.instagram} target="_blank">
                  <Image
                    alt="Instagram"
                    width={24}
                    height={24}
                    src="/socials/instagram.svg"
                  ></Image>
                </a>
              )}
              {footer.linkedin && (
                <a href={footer.linkedin} target="_blank">
                  <Image
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    src="/socials/linkedin.svg"
                  ></Image>
                </a>
              )}
              {footer.twitter && (
                <a href={footer.twitter} target="_blank">
                  <Image
                    alt="Twitter"
                    width={24}
                    height={24}
                    src="/socials/twitter.svg"
                  ></Image>
                </a>
              )}
              {footer.facebook && (
                <a href={footer.facebook} target="_blank">
                  <Image
                    alt="Facebook"
                    width={24}
                    height={24}
                    src="/socials/facebook.svg"
                  ></Image>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
