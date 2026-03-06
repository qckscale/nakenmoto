"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.scss";
import { i18Link } from "@/lib/utils/lang/getLink";
import { translate } from "@/lib/utils/lang/translate";

interface HeroSlide {
  _id: string;
  name: string;
  slug: string;
  images: {
    url: string;
    alt?: string;
    lqip?: string;
  };
  collection?: {
    title: string;
    slug: string;
  };
}

interface HeroSliderProps {
  slides: HeroSlide[];
  ctaLabel?: string;
  locale: string;
}

export function HeroSlider({ slides, ctaLabel, locale }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (isPaused || prefersReducedMotion.current || slides.length <= 1) return;
    const timer = setInterval(() => goTo(activeIndex + 1), 6000);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, goTo, slides.length]);

  if (!slides || slides.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(activeIndex + (delta > 0 ? 1 : -1));
    }
  };

  return (
    <section
      className={styles.slider}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label={translate("featured_products", locale as "sv" | "en")}
    >
      <div className={styles.slides} aria-live="polite">
        {slides.map((slide, i) => (
          <div
            key={slide._id}
            className={`${styles.slide} ${i === activeIndex ? styles.active : ""}`}
            aria-hidden={i !== activeIndex}
          >
            {slide.images?.url && (
              <Image
                src={slide.images.url}
                alt={slide.images.alt || slide.name}
                fill
                sizes="100vw"
                className={styles.image}
                placeholder={slide.images.lqip ? "blur" : undefined}
                blurDataURL={slide.images.lqip || undefined}
                priority={i === 0}
              />
            )}
            <div className={styles.overlay} />
            <div className={`container-width ${styles.content}`}>
              {slide.collection && (
                <span className={styles.collection}>
                  {slide.collection.title}
                </span>
              )}
              <h2 className={styles.productName}>{slide.name}</h2>
              <div className={styles.ctas}>
                <Link href={i18Link(`shop/${slide.slug}`, locale)}>
                  <button className="primary">
                    {translate("view_product", locale as "sv" | "en")}
                  </button>
                </Link>
                <Link href={i18Link("shop", locale)}>
                  <button className="secondary">
                    {ctaLabel || translate("shop", locale as "sv" | "en")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide._id}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${slide.name}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroSlider;
