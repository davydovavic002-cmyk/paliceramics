import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Hard-key near-black neutral pixels only — no halos on colored art */
async function keyBlackBackground(input, output) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.from(data);

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    px[i + 3] = sum < 130 && r < 55 && g < 55 && b < 80 ? 0 : 255;
  }

  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  console.log("written", output);
}

const assets = "C:/Users/79194/.cursor/projects/d-vol2/assets";

await keyBlackBackground(
  path.join(
    assets,
    "c__Users_79194_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_logo-e1235741-c2a4-4e37-a56d-b4a44d008c28.png"
  ),
  path.join(root, "public/images/brand/pali-logo-circle.png")
);

await keyBlackBackground(
  path.join(
    assets,
    "c__Users_79194_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images____________-1f6b1058-2148-446a-b603-7ee40b092b03.png"
  ),
  path.join(root, "public/images/hero/ceramics-cluster.png")
);
