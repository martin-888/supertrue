import React, { useEffect, useRef } from "react";

import base from "./base.png";

const styles = {
  wrapper: {
    maxWidth: "800px",
    backgroundImage: `url(${base})`,
    backgroundSize: "contain",
  },
  canvas: {
    maxWidth: "100%",
    display: "block",
  },
};

// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
const getLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  return lines.find((l) => ctx.measureText(l).width > maxWidth)
    ? ["1", "2", "3", "4"]
    : lines;
};

type LivePreviewNFTProps = {
  title: string;
};

const generateImage = (ctx: CanvasRenderingContext2D, title: string) => {
  ctx.fillStyle = "white";

  // Name
  const words = title.split(" ").length;

  let fontSize = 164;
  ctx.font = `${fontSize}px DM Serif Display`;
  let lines = getLines(ctx, title, 680);
  while (lines.length > 2) {
    fontSize -= 10;
    ctx.font = `${fontSize}px DM Serif Display`;
    lines = getLines(ctx, title, 680);

    if (fontSize <= 114 && words >= 3) {
      break;
    }
  }

  if (lines.length > 2) {
    fontSize = 134;
    ctx.font = `${fontSize}px DM Serif Display`;
    lines = getLines(ctx, title, 680);
    while (lines.length > 3) {
      fontSize -= 10;
      ctx.font = `${fontSize}px DM Serif Display`;
      lines = getLines(ctx, title, 680);
    }
  }

  const startX = 64;
  const startY = lines.length === 3 ? 160 : 200;

  ctx.fillText(lines[0], startX, startY);
  if (lines.length > 1) {
    ctx.fillText(lines[1], startX, startY + fontSize);
  }
  if (lines.length > 2) {
    ctx.fillText(lines[2], startX, startY + fontSize + fontSize);
  }
};

export default function LivePreviewNFT({ title }: LivePreviewNFTProps) {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const ctx = ref?.current?.getContext("2d");
    ctx && generateImage(ctx, title);
  }, [ref, title]);

  return (
    <div style={styles.wrapper}>
      <canvas width={800} height={800} ref={ref} style={styles.canvas} />
    </div>
  );
}
