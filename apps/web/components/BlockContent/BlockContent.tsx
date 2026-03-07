"use client";

/* eslint-disable @next/next/no-img-element */
import { PortableText } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";
import { createImageUrlBuilder } from "@sanity/image-url";

import styles from "./BlockContent.module.scss";
import { client } from "@/lib/sanity";
import CodeBlock from "@/components/CodeBlock/CodeBlock";

const builder = createImageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
const Image = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      className={styles.blockContentImage}
      src={urlFor(value)
        .quality(80)
        .image(value)
        .fit("max")
        .auto("format")
        .width(900)
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        aspectRatio: width / height,
      }}
    />
  );
};

export default function BlockContent({ content, className }: any) {
  return !content ? null : (
    <div className={styles.blockContent}>
      <PortableText
        value={content}
        components={{
          types: {
            image: Image,
            code: (props: any) => {
              return <CodeBlock code={props.value.code} />;
            },
          },
        }}
      />
    </div>
  );
}
