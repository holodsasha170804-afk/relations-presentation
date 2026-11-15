import path from "node:path";
import sharp from "sharp";

export async function cropDefinitionImage(filename) {
  const { data, info } = await sharp(filename)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;

  for (let row = 0; row < info.height; row += 1) {
    for (let column = 0; column < info.width; column += 1) {
      if (data[(row * info.width + column) * info.channels + 3] !== 0) {
        left = Math.min(left, column);
        top = Math.min(top, row);
        right = Math.max(right, column);
        bottom = Math.max(bottom, row);
      }
    }
  }

  if (right < left) throw new Error(`Empty definition image: ${filename}`);

  const width = right - left + 1;
  const height = bottom - top + 1;
  const source = await sharp(filename)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  const style = [
    `left:${(left / info.width) * 100}%`,
    `top:${(top / info.height) * 100}%`,
    `width:${(width / info.width) * 100}%`,
    `height:${(height / info.height) * 100}%`,
  ].join(";");

  return { source, style, left, top, width, height };
}

export async function maskCoverRoute(filename) {
  const { data, info } = await sharp(filename)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let row = 0; row < info.height; row += 1) {
    for (let column = 0; column < info.width; column += 1) {
      const horizontal =
        (column + 0.5 - info.width * 0.55) / (info.width * 0.98);
      const vertical = (row + 0.5 - info.height * 0.45) / (info.height * 1.05);
      const distance = Math.hypot(horizontal, vertical);
      const opacity = Math.max(0, Math.min(1, (1 - distance) / 0.27));
      const alphaIndex = (row * info.width + column) * info.channels + 3;
      data[alphaIndex] = Math.round(data[alphaIndex] * opacity);
    }
  }

  return sharp(data, { raw: info })
    .blur((0.45 * info.width) / 1920)
    .png()
    .toBuffer();
}

export function definitionImages() {
  let isBuild = false;

  return {
    name: "definition-images",
    enforce: "pre",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    async load(id) {
      const isCoverRoute = id.endsWith("?cover-route");
      const suffix = isCoverRoute ? "?cover-route" : "?definition-layer";
      if (!id.endsWith(suffix)) return null;
      const filename = id.slice(0, -suffix.length);
      this.addWatchFile(filename);
      const { source, style } = isCoverRoute
        ? { source: await maskCoverRoute(filename) }
        : await cropDefinitionImage(filename);
      const reference = isBuild
        ? this.emitFile({
            type: "asset",
            name: `${isCoverRoute ? "masked" : "cropped"}-${path.basename(filename)}`,
            source,
          })
        : null;
      const url = isBuild
        ? `import.meta.ROLLUP_FILE_URL_${reference}`
        : JSON.stringify(`data:image/png;base64,${source.toString("base64")}`);

      return isCoverRoute
        ? `export default ${url};`
        : `export default { src: ${url}, style: ${JSON.stringify(style)} };`;
    },
  };
}
