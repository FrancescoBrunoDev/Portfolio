"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

type MDXClientProps = {
  source: MDXRemoteSerializeResult;
};

export default function MDXClient({ source }: MDXClientProps) {
  return <MDXRemote {...source} />;
}
