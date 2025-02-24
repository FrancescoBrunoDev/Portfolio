import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import Reference from "@/components/blog/reference";

const components = { Reference };

type MDXClientProps = {
  source: MDXRemoteSerializeResult;
};

export default function MDXClient({ source }: MDXClientProps) {
  return <MDXRemote {...source} components={components} lazy />;
}
