import { FC, memo, useState } from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { generateRandomString, programmingLanguages } from "@/lib/codeblock";

interface Props {
  language: string;
  value: string;
  disabled: boolean;
}

export const CodeBlock: FC<Props> = memo(({ language, value, disabled }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  
  return (
    <div className="flex gap-4 codeblock relative font-sans text-[16px]">
      <SyntaxHighlighter language="html" style={oneDark} customStyle={{ margin: 0, width:"100%" }}>
        {value}
      </SyntaxHighlighter>

      <button
        disabled={disabled}
        className="flex items-center justify-center gap-1.5 rounded bg-none p-2 text-xs text-indigo-500 disabled:cursor-not-allowed border border-indigo-400 w-36 hover:bg-indigo-600 hover:text-white"
        onClick={copyToClipboard}
      >
        {isCopied ? <CheckIcon size={18} /> : <ClipboardIcon size={18} />}
        {isCopied ? "Copied!" : "Copy code"}
      </button>
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";
