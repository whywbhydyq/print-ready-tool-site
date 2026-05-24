# 第四项目开发计划：图像尺寸、比例、DPI 与安全区工具矩阵

版本：2026-05-24  
目标站点：`print.ymirtool.com`  
目标仓库：`whywbhydyq/print-ready-tool-site`  
项目定位：并入现有印前工具站，扩展图片尺寸、比例、DPI、纸张像素、平台安全区、透明 overlay 与模板下载能力。  
开发原则：MVP 优先、前端本地处理、无账号、无云端保存、无重图片编辑、无 AI 出图、无复杂压缩。  

---

## 0. 执行摘要

第四项目不是单独开一个“社交媒体图片尺寸大全”站，而是在 `print.ymirtool.com` 内新增一个 **Image Size / DPI / Safe Zone 工具矩阵**。

核心目标是解决用户在上传或打印图片前的失败风险：

- 图片尺寸是否满足平台要求。
- 图片比例是否会被裁切。
- 关键文字、logo、人物脸、商品主体是否可能被 UI 遮挡。
- 图片是否足够清晰用于 A4、海报、名片等打印尺寸。
- DPI、PPI、像素、厘米、英寸、纸张尺寸如何换算。
- 能否下载透明 overlay 或空白模板，在 Canva、Figma、Photoshop、Illustrator 等工具里对照使用。

MVP 第一版只做 10 个 P0 页面：

1. Aspect Ratio Calculator  
2. Print Size Calculator  
3. DPI / PPI Calculator  
4. CM to Pixels Calculator  
5. A4 Size in Pixels  
6. YouTube Banner Safe Area Tool  
7. YouTube Thumbnail Safe Zone  
8. Short Video Safe Zone Overlay  
9. LinkedIn Banner Size & Safe Zone  
10. X Header Size Crop Preview  

第一版不做：

- 完整图片编辑器
- AI 出图
- 登录系统
- 云端保存
- 图片上传服务器
- 批量压缩
- 指定 KB 压缩
- PSD 在线编辑
- App Store 全设备矩阵
- Google Play 全截图管理
- 自动识别商品主体是否被裁

---

## 1. 项目背景

### 1.1 为什么要做

`print.ymirtool.com` 当前的核心语义是 print-ready、DPI、纸张尺寸、bleed、安全边距、印前检查。图像尺寸与比例矩阵天然可以补强这个垂直方向。

该项目的真实用户需求并不是简单查一行尺寸，而是：

- “我这张图上传后会不会被裁？”
- “YouTube banner 为什么按 2560×1440 做了，手机端还是只显示中间？”
- “TikTok/Reels/Shorts 的按钮和字幕会不会挡住文字？”
- “A4 300DPI 到底是多少像素？”
- “72DPI 的图能不能打印？”
- “px、cm、inch、DPI 怎么互相换算？”
- “X header 1500×500 为什么还是会被上下裁？”
- “LinkedIn cover 的关键内容应该放哪里？”
- “有没有透明 safe zone overlay 可以下载？”

这些需求具备工具站特征：输入明确、输出即时、低敏感、复用性中高、能和 AdSense / affiliate 自然承接。

### 1.2 为什么不单独开站

不单独开站的原因：

1. “social media image sizes” 是强竞争泛内容赛道，Canva、Adobe、Buffer、Hootsuite、Sprout、Later 等站点强势。
2. 单独做尺寸大全容易被 AI 摘要和搜索结果快速答案截流。
3. 并入 print 站后可以与 DPI、paper size、bleed、safe margin 形成垂直主题。
4. `print.ymirtool.com` 需要内容厚度和低敏感长尾，图像尺寸工具正好补强。
5. 工具矩阵比尺寸表更利于 AdSense 价值判断。

### 1.3 成功形态

最优形态不是“图片尺寸百科”，而是：

> 上传或打印前的图片尺寸风险检查器。

用户进入页面后，应能快速得到：

- 推荐尺寸
- 当前图片是否可用
- 裁切风险
- UI 遮挡风险
- 打印清晰度
- 所需像素
- 透明 overlay
- 可复制结果
- 下一步相关工具

---

## 2. 总体开发原则

### 2.1 MVP 优先

第一版只做 P0。不要为了“完整”拖慢上线。

禁止在第一阶段扩散到：

- 全平台尺寸大全
- 全设备截图矩阵
- 图片编辑器
- 批量转换器
- 批量压缩器
- 图片托管
- 账号收藏
- 模板社区

### 2.2 前端本地处理

所有图片处理必须在浏览器本地完成：

- 使用 File API 读取本地图片。
- 使用 `URL.createObjectURL()` 做本地预览。
- 使用 `<img>.naturalWidth / naturalHeight` 读取尺寸。
- 使用 Canvas / SVG 生成 overlay。
- 不创建上传 API。
- 不保存图片。
- 不记录文件名、本地路径、图片内容。
- 只允许采集宽、高、MIME 类型、文件大小等级、是否触发风险提示等非敏感事件。

上传控件附近必须显示隐私提示：

```text
Your image stays in your browser. We do not upload or store your file.
```

中文可写：

```text
图片仅在你的浏览器本地读取，不会上传服务器，也不会被保存。
```

### 2.3 数据集中管理

平台规格、纸张规格、safe zone、sourceConfidence 必须集中存放，不能散落在页面组件里。

原因：

- 平台规格会变。
- 需要统一显示 `lastCheckedAt`。
- 需要区分 official / strong-secondary / community-observed / internal-estimate。
- 后续 P1/P2 便于扩展。
- SEO 页面内容与工具数据可以共用同一份规范。

### 2.4 SEO 与交互并重

每个页面必须同时满足：

- 首屏有工具。
- 页面有可索引说明文字。
- 不是纯 Canvas/SVG 空页面。
- 有 FAQ。
- 有相关工具内链。
- 有 canonical。
- 进入 sitemap。
- 无 meta keywords。
- 有来源说明和最后检查日期。
- 广告不干扰核心操作。

### 2.5 部署与提交约束

实施代码时遵循：

1. 同一阶段的改动先集中完成和检查，再一次性提交。
2. 优先使用 GitHub low-level API：`create_blob → create_tree → create_commit → update_ref` 批量提交。
3. 除非客观限制，否则不要对同一阶段使用多个零散 `update_file` 提交。
4. 执行前先检查 `vercel.json` 是否已有 `ignoreCommand`。
5. 若缺失，加入旧 commit 构建跳过逻辑，避免连续提交浪费 Vercel 构建额度。
6. 每次结束时区分：
   - GitHub main 是否已提交。
   - Vercel 是否已触发构建。
   - Production 是否部署最新 commit。
   - 线上域名是否可访问最新页面。

---

## 3. 项目范围

### 3.1 P0 范围

P0 必须覆盖：

- 比例计算
- 等比缩放
- 裁切 / padding 建议
- DPI/PPI 换算
- cm/mm/in ↔ px
- A4/A5/A3/Letter 纸张像素
- 图片可打印尺寸
- YouTube banner 多设备安全区
- YouTube thumbnail 时间条遮挡提示
- TikTok/Reels/Shorts 9:16 安全区
- LinkedIn banner / cover 风险区
- X header 上下 60px 裁切风险区
- 本地图片预览
- 透明 PNG/SVG overlay 下载
- 复制结果
- FAQ
- 相关工具内链
- sitemap / metadata / canonical

### 3.2 P1 范围

P1 在 P0 有实际曝光和交互后再做：

- Pinterest Pin Size Checker
- Pinterest 2:3 Ratio Calculator
- Product Image Size Checker
- Google Shopping Image Size Checker
- Shopify Image Megapixel Calculator
- Instagram Image Without Cropping
- Universal Social Image Size Recommender
- Website Banner Crop Preview
- Hero Image Focal Point Preview
- 小红书封面尺寸
- 小红书图片不被裁剪
- Open Graph Image Checker

### 3.3 P2 范围

P2 等 P0/P1 证明有效后再做：

- Google Play Asset Checker
- Google Play Feature Graphic Size
- App Store Screenshot Size Matrix
- iPhone Screenshot Size Calculator
- iPad Screenshot Size Calculator
- Etsy Listing Image Size
- Amazon Product Image Size
- Email Header Image Size
- Passport / ID Photo Size Checker
- Figma / PSD overlay download hub
- Batch Social Media Export Plan

### 3.4 明确不做

第一版禁止做：

- 在线图片编辑器
- AI 图片生成
- 登录
- 云端保存
- 上传服务器
- 图片压缩到指定 KB
- 自动识别商品主体
- OCR 检查文字是否出界
- PSD 在线编辑
- 全平台一页大而全
- 复制官方文档式尺寸大全
- meta keywords

---

## 4. 现有仓库审计计划

正式写代码前，先审计 `whywbhydyq/print-ready-tool-site`。

### 4.1 必查文件

```text
package.json
next.config.*
vercel.json
app/layout.tsx
app/page.tsx
app/sitemap.ts
app/robots.ts
app/not-found.tsx
public/ads.txt
src/app/layout.tsx
src/app/sitemap.ts
src/app/robots.ts
src/app/page.tsx
src/components/*
src/lib/*
src/data/*
```

不同项目可能用 `app/` 或 `src/app/`，审计时以实际结构为准。

### 4.2 必查路由

确认是否已有：

```text
/dpi
/dpi-calculator
/print-size
/paper-size
/a4-size-in-pixels
/bleed
/safe-margin
/tools
/about
/privacy-policy
/disclaimer
/terms
```

若已有同类页面，避免重复 slug；优先增强现有页面或用重定向合并。

### 4.3 必查站点能力

检查：

- 是否 App Router。
- 是否静态导出。
- 是否已有 SEO metadata helper。
- 是否已有 FAQ schema。
- 是否已有 AdSense script。
- 是否已有广告组件。
- 是否已有页脚法务链接。
- 是否已有 analytics 事件封装。
- 是否已有测试框架。
- 是否已有 lint/typecheck/build 脚本。
- 是否已有组件库或 Tailwind。
- 是否已有 sitemap。
- 是否已有 robots。
- 是否已有 canonical 生成方式。

### 4.4 Vercel 构建保护审计

检查 `vercel.json`：

若已有：

```json
{
  "ignoreCommand": "node scripts/skip-old-vercel-builds.mjs"
}
```

则不重复添加。

若没有，应加入：

```json
{
  "ignoreCommand": "node scripts/skip-old-vercel-builds.mjs"
}
```

并新增：

```text
scripts/skip-old-vercel-builds.mjs
```

逻辑：

1. 读取 Vercel 环境变量：
   - `VERCEL_GIT_COMMIT_SHA`
   - `VERCEL_GIT_COMMIT_REF`
   - `VERCEL_GIT_REPO_OWNER`
   - `VERCEL_GIT_REPO_SLUG`
2. 只对 GitHub commit 构建生效。
3. 查询当前分支最新 commit。
4. 如果当前构建 commit 不是最新 commit，则 `process.exit(0)`，跳过旧构建。
5. 如果当前 commit 是最新 commit，则 `process.exit(1)`，继续构建。
6. 如果检查失败，也 `process.exit(1)`，避免误跳过最新部署。

注意：Vercel 的 `ignoreCommand` 语义是 exit code 0 表示跳过构建，非 0 表示继续构建。

---

## 5. 信息架构与路由计划

### 5.1 推荐路由

如果现有站没有冲突，建议：

```text
/image-size
/image-size/aspect-ratio-calculator
/image-size/print-size-calculator
/image-size/dpi-calculator
/image-size/cm-to-pixels
/image-size/a4-size-in-pixels
/image-size/youtube-banner-safe-area
/image-size/youtube-thumbnail-safe-zone
/image-size/short-video-safe-zone
/image-size/linkedin-banner-size
/image-size/x-header-size
```

### 5.2 聚合页

`/image-size` 作为工具矩阵入口。

聚合页模块：

1. Hero：Image Size, DPI & Safe Zone Tools
2. P0 工具卡片
3. Print & DPI tools
4. Social safe zone tools
5. How to choose the right tool
6. FAQ
7. Related print tools
8. Source / update policy

### 5.3 内链结构

每个 P0 页面底部都链接：

- `/image-size`
- Aspect Ratio Calculator
- DPI Calculator
- Print Size Calculator
- A4 Size in Pixels
- 2–3 个相关平台安全区页面

示例：

YouTube Banner 页面相关工具：

- YouTube Thumbnail Safe Zone
- Short Video Safe Zone
- Aspect Ratio Calculator
- DPI Calculator

A4 页面相关工具：

- Print Size Calculator
- DPI Calculator
- CM to Pixels Calculator
- Bleed Calculator（若已有）

### 5.4 面包屑

建议：

```text
Home > Image Size Tools > YouTube Banner Safe Area
```

每页加入 breadcrumb JSON-LD。

---

## 6. 数据层设计

### 6.1 文件结构

建议新增：

```text
src/data/image-tools/imageSpecs.ts
src/data/image-tools/paperSpecs.ts
src/data/image-tools/dpiPresets.ts
src/data/image-tools/toolPages.ts
src/data/image-tools/sourcePolicy.ts
```

若项目不用 `src/`，则放：

```text
data/image-tools/*
```

### 6.2 类型定义

新增：

```ts
export type SourceConfidence =
  | "official"
  | "strong-secondary"
  | "community-observed"
  | "internal-estimate";

export type SpecPriority = "P0" | "P1" | "P2";

export type ZoneSeverity = "safe" | "warning" | "danger" | "info";

export type SafeZone = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "px" | "percent";
  severity: ZoneSeverity;
  description?: string;
};

export type DeviceVariant = {
  id: string;
  label: string;
  visibleWidth: number;
  visibleHeight: number;
  x?: number;
  y?: number;
  note?: string;
};

export type ImageSpec = {
  id: string;
  platform: string;
  assetType: string;
  title: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  maxFileSizeMB?: number;
  maxFileSizeKB?: number;
  maxMegapixels?: number;
  aspectRatio?: string;
  commonPresets?: Array<{ label: string; width: number; height: number }>;
  supportedFormats?: string[];
  safeZones?: SafeZone[];
  cropRiskZones?: SafeZone[];
  uiObstructionZones?: SafeZone[];
  deviceVariants?: DeviceVariant[];
  notes: string[];
  sourceUrl?: string;
  sourceLabel?: string;
  sourceConfidence: SourceConfidence;
  lastCheckedAt: string;
  needsManualReview?: boolean;
  reviewNotes?: string;
  priority: SpecPriority;
  relatedToolSlugs: string[];
};
```

### 6.3 P0 规格数据

#### YouTube Banner

```ts
{
  id: "youtube-banner",
  platform: "YouTube",
  assetType: "channel-banner",
  title: "YouTube Banner / Channel Art",
  recommendedWidth: 2560,
  recommendedHeight: 1440,
  maxFileSizeMB: 6,
  supportedFormats: ["JPG", "GIF", "BMP", "PNG"],
  safeZones: [
    {
      id: "youtube-banner-all-devices-safe-area",
      label: "All devices safe area",
      x: 507,
      y: 508.5,
      width: 1546,
      height: 423,
      unit: "px",
      severity: "safe"
    }
  ],
  deviceVariants: [
    { id: "mobile", label: "Mobile", visibleWidth: 1546, visibleHeight: 423 },
    { id: "tablet", label: "Tablet", visibleWidth: 1855, visibleHeight: 423 },
    { id: "desktop", label: "Desktop", visibleWidth: 2560, visibleHeight: 423 },
    { id: "tv", label: "TV", visibleWidth: 2560, visibleHeight: 1440 }
  ],
  sourceConfidence: "strong-secondary",
  lastCheckedAt: "2026-05-24",
  priority: "P0"
}
```

备注：Adobe Express 作为 strong-secondary。若后续找到 YouTube 官方精确 help 文档，可升为 official。

#### YouTube Thumbnail

```ts
{
  id: "youtube-thumbnail",
  platform: "YouTube",
  assetType: "video-thumbnail",
  title: "YouTube Thumbnail",
  aspectRatio: "16:9",
  minWidth: 640,
  supportedFormats: ["JPG", "GIF", "PNG"],
  commonPresets: [
    { label: "Common HD", width: 1280, height: 720 },
    { label: "Full HD", width: 1920, height: 1080 },
    { label: "4K", width: 3840, height: 2160 }
  ],
  uiObstructionZones: [
    {
      id: "youtube-thumbnail-time-badge",
      label: "Possible time badge area",
      x: 0.78,
      y: 0.80,
      width: 0.20,
      height: 0.16,
      unit: "percent",
      severity: "warning"
    }
  ],
  notes: [
    "Keep key text away from the bottom-right timer area.",
    "Vertical video thumbnails may appear differently in some YouTube mobile surfaces."
  ],
  sourceConfidence: "official",
  lastCheckedAt: "2026-05-24",
  priority: "P0"
}
```

#### Short Video Safe Zone

```ts
{
  id: "short-video-safe-zone",
  platform: "TikTok / Reels / Shorts",
  assetType: "vertical-video",
  title: "Short Video Safe Zone",
  aspectRatio: "9:16",
  commonPresets: [
    { label: "1080×1920", width: 1080, height: 1920 },
    { label: "720×1280", width: 720, height: 1280 },
    { label: "540×960", width: 540, height: 960 }
  ],
  uiObstructionZones: [
    {
      id: "right-action-buttons",
      label: "Right action buttons",
      x: 0.82,
      y: 0.32,
      width: 0.16,
      height: 0.40,
      unit: "percent",
      severity: "warning"
    },
    {
      id: "bottom-caption-area",
      label: "Caption / CTA area",
      x: 0,
      y: 0.78,
      width: 1,
      height: 0.20,
      unit: "percent",
      severity: "warning"
    },
    {
      id: "top-ui-area",
      label: "Top UI area",
      x: 0,
      y: 0,
      width: 1,
      height: 0.10,
      unit: "percent",
      severity: "warning"
    }
  ],
  sourceConfidence: "official",
  reviewNotes: "Official confidence applies to TikTok ratio and safe-zone concept; cross-platform overlay zones are conservative estimates.",
  lastCheckedAt: "2026-05-24",
  priority: "P0"
}
```

#### LinkedIn

```ts
{
  id: "linkedin-page-cover",
  platform: "LinkedIn",
  assetType: "page-cover",
  title: "LinkedIn Page Cover Image",
  recommendedWidth: 4200,
  recommendedHeight: 700,
  supportedFormats: ["PNG", "JPEG"],
  cropRiskZones: [
    {
      id: "linkedin-cover-edge-risk",
      label: "Edge crop risk",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      unit: "percent",
      severity: "warning"
    },
    {
      id: "linkedin-cover-lower-right-risk",
      label: "Lower-right risk area",
      x: 0.75,
      y: 0.70,
      width: 0.25,
      height: 0.30,
      unit: "percent",
      severity: "warning"
    }
  ],
  notes: [
    "LinkedIn may crop cover images horizontally or vertically depending on device and screen size.",
    "Keep important content away from edges, especially the lower-right corner."
  ],
  sourceConfidence: "official",
  lastCheckedAt: "2026-05-24",
  priority: "P0"
}
```

#### X Header

```ts
{
  id: "x-header",
  platform: "X",
  assetType: "profile-header",
  title: "X Header Image",
  recommendedWidth: 1500,
  recommendedHeight: 500,
  cropRiskZones: [
    {
      id: "x-header-top-60px",
      label: "Top 60px may be cropped",
      x: 0,
      y: 0,
      width: 1500,
      height: 60,
      unit: "px",
      severity: "warning"
    },
    {
      id: "x-header-bottom-60px",
      label: "Bottom 60px may be cropped",
      x: 0,
      y: 440,
      width: 1500,
      height: 60,
      unit: "px",
      severity: "warning"
    }
  ],
  notes: [
    "Even at the recommended 1500×500 size, X may crop up to about 60px from the top and bottom on different screens."
  ],
  sourceConfidence: "official",
  lastCheckedAt: "2026-05-24",
  priority: "P0"
}
```

### 6.4 纸张数据

```ts
export type PaperSpec = {
  id: string;
  name: string;
  widthMm?: number;
  heightMm?: number;
  widthIn?: number;
  heightIn?: number;
  group: "ISO" | "US" | "Photo" | "Business";
};

export const paperSpecs: PaperSpec[] = [
  { id: "a0", name: "A0", widthMm: 841, heightMm: 1189, group: "ISO" },
  { id: "a1", name: "A1", widthMm: 594, heightMm: 841, group: "ISO" },
  { id: "a2", name: "A2", widthMm: 420, heightMm: 594, group: "ISO" },
  { id: "a3", name: "A3", widthMm: 297, heightMm: 420, group: "ISO" },
  { id: "a4", name: "A4", widthMm: 210, heightMm: 297, group: "ISO" },
  { id: "a5", name: "A5", widthMm: 148, heightMm: 210, group: "ISO" },
  { id: "a6", name: "A6", widthMm: 105, heightMm: 148, group: "ISO" },
  { id: "letter", name: "US Letter", widthIn: 8.5, heightIn: 11, group: "US" },
  { id: "legal", name: "US Legal", widthIn: 8.5, heightIn: 14, group: "US" },
  { id: "tabloid", name: "Tabloid", widthIn: 11, heightIn: 17, group: "US" }
];

export const dpiPresets = [72, 96, 150, 200, 300, 600];
```

---

## 7. 计算库设计

新增：

```text
src/lib/image-tools/aspectRatio.ts
src/lib/image-tools/dpi.ts
src/lib/image-tools/printSize.ts
src/lib/image-tools/paperSize.ts
src/lib/image-tools/cropFit.ts
src/lib/image-tools/megapixel.ts
src/lib/image-tools/format.ts
src/lib/image-tools/overlay.ts
```

### 7.1 Aspect Ratio

函数：

```ts
gcd(a: number, b: number): number
simplifyRatio(width: number, height: number): { w: number; h: number; label: string }
calculateHeight(width: number, ratioW: number, ratioH: number): number
calculateWidth(height: number, ratioW: number, ratioH: number): number
detectCommonRatio(width: number, height: number): CommonRatio | null
getRatioMismatch(sourceW, sourceH, targetW, targetH): number
```

验收：

- 1920×1080 → 16:9
- 1080×1920 → 9:16
- 1080×1350 → 4:5
- 1200×627 → 1.91:1 近似
- 1000×1500 → 2:3

### 7.2 DPI / PPI

函数：

```ts
pxToInches(px: number, ppi: number): number
inchesToPx(inches: number, ppi: number): number
cmToPx(cm: number, ppi: number): number
pxToCm(px: number, ppi: number): number
mmToPx(mm: number, ppi: number): number
pxToMm(px: number, ppi: number): number
calculatePpi(px: number, physicalSize: number, unit: "in" | "cm" | "mm"): number
```

公式：

```text
inches = cm / 2.54
inches = mm / 25.4
px = inches × ppi
ppi = px / inches
```

验收：

- 10cm at 300DPI ≈ 1181px
- 3000px at 300DPI = 10in = 25.4cm
- 210mm at 300DPI ≈ 2480px
- 297mm at 300DPI ≈ 3508px

### 7.3 Print Size

函数：

```ts
calculatePrintSize(widthPx, heightPx, ppi): { widthIn, heightIn, widthCm, heightCm }
calculateRequiredPixels(width, height, unit, ppi): { widthPx, heightPx }
gradePrintQuality(ppi): "High" | "Good" | "Low" | "Not recommended"
compareImageToTargetPrint(widthPx, heightPx, targetPaper, ppi): PrintFitResult
```

评级：

| PPI | 评级 | 说明 |
|---|---|---|
| >= 300 | High | 常规高质量印刷 |
| 200–299 | Good | 多数普通打印可接受 |
| 150–199 | Low | 远看可能可用，近看风险高 |
| < 150 | Not recommended | 近距离观看明显模糊风险 |

### 7.4 Paper Size

函数：

```ts
paperToPixels(paperSpec, dpi, orientation): { widthPx, heightPx }
addBleedToPaper(paperSpec, bleedMm): PaperSpec
safeMarginBox(paperSpec, marginMm): SafeZone
```

验收：

- A4 300DPI portrait ≈ 2480×3508
- A4 300DPI landscape ≈ 3508×2480
- A4 + 3mm bleed = 216mm × 303mm
- A4 300DPI + 3mm bleed ≈ 2551×3579

### 7.5 Crop / Fit

函数：

```ts
calculateCenterCrop(sourceW, sourceH, targetW, targetH): CropRect
calculateFitWithPadding(sourceW, sourceH, targetW, targetH): FitResult
calculateCropLoss(sourceW, sourceH, cropRect): number
recommendResizeStrategy(source, target): "crop" | "fit-with-padding" | "resize-only"
```

验收：

- 3:2 图片转 1:1，左右裁切。
- 16:9 图片转 9:16，左右大量裁切，风险高。
- 9:16 图片转 16:9，上下大量裁切，风险高。
- 同比例只等比缩放，不裁切。

### 7.6 Megapixel

函数：

```ts
calculateMegapixels(widthPx, heightPx): number
isOverMegapixelLimit(widthPx, heightPx, maxMp): boolean
formatFileSize(bytes): string
```

用于 P1，但 P0 可先实现底层。

---

## 8. 组件设计

新增组件目录：

```text
src/components/image-tools/
  AspectRatioCalculator.tsx
  DpiCalculator.tsx
  PrintSizeCalculator.tsx
  UnitPixelCalculator.tsx
  PaperPixelCalculator.tsx
  SafeZoneCanvas.tsx
  ImageUploadPreview.tsx
  OverlayDownloadButtons.tsx
  SpecResultCard.tsx
  RiskBadge.tsx
  SourceNote.tsx
  RelatedTools.tsx
  ToolPageHeader.tsx
  ToolFaq.tsx
  CopyButton.tsx
```

### 8.1 ToolPageHeader

职责：

- H1
- 一句话定位
- 更新时间
- 来源等级
- 隐私提示（有上传控件时）
- 快速跳转

### 8.2 SpecResultCard

展示：

- Recommended size
- Aspect ratio
- Minimum size
- File size limit
- Format
- Last checked
- Risk notes
- Copy buttons

### 8.3 SafeZoneCanvas

输入：

```ts
type SafeZoneCanvasProps = {
  width: number;
  height: number;
  safeZones?: SafeZone[];
  cropRiskZones?: SafeZone[];
  uiObstructionZones?: SafeZone[];
  deviceVariants?: DeviceVariant[];
  uploadedImageUrl?: string;
  activeVariant?: string;
  showLabels?: boolean;
};
```

职责：

- 按比例缩放大画布。
- 显示上传图片。
- 叠加 safe zones。
- 叠加 warning/danger zones。
- 支持设备 variant 切换。
- 支持 label。
- 移动端可横向滚动或自适应。

### 8.4 OverlayDownloadButtons

功能：

- Download SVG Overlay
- Download PNG Overlay
- Copy dimensions
- Copy safe zone coordinates

要求：

- 按钮附近不放广告。
- 下载文件名可读：
  - `youtube-banner-safe-area-overlay-2560x1440.svg`
  - `x-header-crop-risk-overlay-1500x500.png`
- PNG 透明背景。
- SVG 带 `viewBox` 和实际 width/height。

### 8.5 ImageUploadPreview

功能：

- file input
- drag & drop 可选
- 本地预览
- naturalWidth / naturalHeight
- file size
- MIME type
- megapixels
- object URL revoke
- privacy note

验收：

- 换图时 revoke old object URL。
- 组件卸载时 revoke current object URL。
- 不触发上传请求。
- 不显示本地路径。
- 不记录文件名到 analytics。

### 8.6 RiskBadge

状态：

```ts
"safe" | "warning" | "risky" | "unsupported" | "unknown"
```

文案：

- Safe: This image is likely suitable for the selected use.
- Warning: The size may work, but key content may be cropped or covered.
- Risky: This image is likely to be cropped, blurred, or rejected.
- Unsupported: This image does not meet the selected requirement.
- Unknown: This platform does not provide exact safe-zone data; use this as a conservative reference.

---

## 9. P0 页面逐页开发计划

### 9.1 `/image-size/aspect-ratio-calculator`

目标关键词：

- aspect ratio calculator
- 16:9 aspect ratio calculator
- 4:5 aspect ratio calculator
- 9:16 aspect ratio calculator
- resize image without cropping

用户问题：

- 当前图片是什么比例？
- 改成 16:9 / 4:5 / 9:16 会不会裁？
- 目标宽度下高度是多少？
- 目标高度下宽度是多少？
- 应该 crop 还是 padding？

输入：

- width
- height
- target ratio preset
- target width optional
- target height optional
- mode: resize / crop / fit with padding

输出：

- simplified ratio
- decimal ratio
- target dimensions
- crop loss %
- padding dimensions
- recommended strategy
- copy result

FAQ：

- What is aspect ratio?
- How do I resize without cropping?
- What is 16:9 in pixels?
- What is 4:5 used for?
- Why does Instagram crop my image?

验收：

- 输入错误有提示。
- 结果自动更新。
- 常见比例正确识别。
- 与短视频、YouTube、LinkedIn 页面互链。

---

### 9.2 `/image-size/print-size-calculator`

目标关键词：

- print size calculator
- image print size calculator
- 300 dpi print size calculator
- how large can I print my image
- photo print size calculator

用户问题：

- 我的图片能打印多大？
- 300DPI 下可以印几英寸？
- A4 打印够不够清晰？
- 72DPI 的图能不能打印？

输入：

- image width px
- image height px
- target PPI
- optional target paper
- optional bleed
- optional safe margin
- optional local image upload

输出：

- max print size in inches / cm / mm
- quality grade
- target paper pass/fail
- required pixels for target paper
- missing pixels %
- explanation

FAQ：

- Is DPI the same as PPI?
- Can I print a 72 DPI image?
- Does changing DPI make an image sharper?
- What resolution do I need for A4?
- What is a good PPI for printing?

验收：

- 3000px at 300PPI = 10 inches。
- 上传图片后自动填入宽高。
- 不上传服务器。
- 显示隐私提示。

---

### 9.3 `/image-size/dpi-calculator`

目标关键词：

- dpi calculator
- ppi calculator
- 300 dpi calculator
- pixels per inch calculator
- resolution calculator

输入：

- mode:
  - pixels + physical size → PPI
  - physical size + PPI → pixels
  - pixels + PPI → physical size
- unit: inch / cm / mm
- width / height

输出：

- PPI
- required pixels
- physical size
- comparison table 72/96/150/300/600
- copy result

FAQ：

- What is DPI?
- What is PPI?
- Why does 72 DPI not mean low quality by itself?
- How many pixels per cm at 300 DPI?
- What DPI should I use for print?

验收：

- 支持双向换算。
- 单位切换结果正确。
- 解释文案不误导。

---

### 9.4 `/image-size/cm-to-pixels`

目标关键词：

- cm to px
- px to cm
- mm to pixels
- inches to pixels
- pixels to inches

输入：

- value
- source unit
- target unit
- DPI/PPI

输出：

- converted value
- rounded pixels
- precise value
- common DPI table
- copy result

FAQ：

- How many pixels is 1 cm at 300 DPI?
- How do I convert px to cm?
- Why do I need DPI to convert cm to pixels?
- Is 96 DPI for screen or print?

验收：

- 10cm at 300DPI ≈ 1181px。
- 1181px at 300DPI ≈ 10cm。
- mm/in/cm 切换正确。

---

### 9.5 `/image-size/a4-size-in-pixels`

目标关键词：

- a4 size in pixels
- a4 300 dpi pixels
- a4 pixels
- a4 dimensions in pixels
- letter size in pixels

输入：

- paper preset
- DPI preset
- orientation
- bleed mm optional
- safe margin mm optional

输出：

- paper size in mm/in
- pixel size
- pixel size with bleed
- safe margin box
- copy dimensions
- download blank SVG template optional

FAQ：

- What is A4 size in pixels at 300 DPI?
- What is A4 at 150 DPI?
- What is A4 plus 3mm bleed?
- Should I use 300 DPI for printing?
- Why are A4 pixel values rounded?

验收：

- A4 300DPI = 2480×3508 左右。
- 横竖方向切换正确。
- bleed 尺寸正确。
- 结果区清楚区分 trim size 和 bleed size。

---

### 9.6 `/image-size/youtube-banner-safe-area`

目标关键词：

- youtube banner safe area
- youtube banner size
- youtube channel art safe zone
- youtube banner template
- 2560x1440 youtube banner

输入：

- optional local image upload
- active device variant
- show/hide labels
- show all zones

输出：

- full canvas 2560×1440
- all devices safe area 1546×423
- mobile / tablet / desktop / TV visible areas
- warning if uploaded image not 2560×1440 or same ratio
- PNG/SVG overlay download
- copy dimensions

FAQ：

- Why does my YouTube banner look different on mobile?
- What is the YouTube banner safe area?
- What size should a YouTube channel banner be?
- Where should I place my logo and text?
- Can I use this overlay in Canva or Photoshop?

验收：

- safe area 居中。
- device variants 切换。
- overlay 下载尺寸正确。
- 上传图不上传服务器。
- 结果明确说明尺寸正确不代表所有内容都可见。

---

### 9.7 `/image-size/youtube-thumbnail-safe-zone`

目标关键词：

- youtube thumbnail safe zone
- youtube thumbnail size
- youtube thumbnail dimensions
- youtube thumbnail timer overlay
- youtube shorts thumbnail size

输入：

- preset: 1280×720 / 1920×1080 / 3840×2160
- optional upload
- show timer badge
- mode: regular video / vertical video note

输出：

- aspect ratio 16:9
- common recommended sizes
- timer badge risk zone
- upload risk if too small
- Shorts / vertical video warning
- overlay download

FAQ：

- What size should a YouTube thumbnail be?
- Where does the video time badge appear?
- Should I use 1280×720 or 3840×2160?
- Why does my Shorts thumbnail look different?
- What file formats does YouTube support?

验收：

- bottom-right timer zone 显示。
- common presets 可切换。
- 不把 1280×720 写成唯一官方尺寸。
- 显示“官方建议高分辨率，常见创作者 preset 为 1280×720”。

---

### 9.8 `/image-size/short-video-safe-zone`

目标关键词：

- tiktok safe zone
- instagram reels safe zone
- youtube shorts safe zone
- 9:16 safe zone
- vertical video safe area

输入：

- platform preset: TikTok / Reels / Shorts / Generic 9:16
- canvas preset: 1080×1920 / 720×1280 / 540×960
- caption length: short / medium / long
- optional upload
- show/hide zones

输出：

- 9:16 dimensions
- right action buttons zone
- bottom caption zone
- top UI zone
- risk notes
- overlay download

FAQ：

- What is the TikTok safe zone?
- Can I use one cover for TikTok, Reels, and Shorts?
- Where should I place text in a vertical video?
- Why do buttons cover my video?
- Is this safe zone exact?

验收：

- 明确标注：TikTok 规格有官方参考；跨平台 overlay 是保守参考，不保证所有 app 版本一致。
- Instagram/Reels 精确坐标若未官方复核，不写成官方数据。
- caption 长度会改变 bottom risk zone 显示。

---

### 9.9 `/image-size/linkedin-banner-size`

目标关键词：

- linkedin banner size
- linkedin banner safe zone
- linkedin company page cover size
- linkedin post image size
- linkedin cover image dimensions

输入：

- asset type:
  - Page Cover
  - Page Logo
  - URL Post Image
- optional upload
- show edge risk
- show lower-right risk

输出：

- Page Cover 4200×700
- Logo 400×400
- URL post 1200×627 / 1.91:1
- edge crop risk
- lower-right warning
- copy result
- overlay download for Page Cover

FAQ：

- What size is a LinkedIn Page cover image?
- Why does LinkedIn crop my banner?
- What is the best LinkedIn post image ratio?
- Where should I place text on a LinkedIn cover?
- What formats does LinkedIn support?

验收：

- 区分个人 banner 与 Page cover，若个人 banner 数据未验证则不要混写。
- 明确说明 LinkedIn 会按设备裁切。
- lower-right risk zone 文案清楚。

---

### 9.10 `/image-size/x-header-size`

目标关键词：

- x header size
- twitter header size
- x header safe zone
- twitter header safe zone
- x profile header crop

输入：

- optional upload
- show top/bottom crop risk
- show profile image note

输出：

- full canvas 1500×500
- top 60px warning
- bottom 60px warning
- profile image 400×400 note
- copy result
- overlay download

FAQ：

- What size is an X header image?
- Why does X crop my header?
- What area of a Twitter/X header may be cropped?
- Should I keep text in the center?
- What is the X profile image size?

验收：

- top/bottom 60px zones 正确。
- 不把头像遮挡区当作官方精确坐标，除非后续验证。
- overlay 下载正确。

---

## 10. 页面内容模板

每个页面结构：

```text
1. H1
2. 一句话说明
3. 工具输入区
4. 结果卡片
5. 可视化预览 / overlay
6. 复制 / 下载按钮
7. How to use this result
8. Source and last checked
9. Common mistakes
10. FAQ
11. Related tools
12. Disclaimer
```

### 10.1 Source Note 模板

```text
Source note: Platform image requirements can change. This page separates official requirements from conservative safe-zone estimates. Last checked: 2026-05-24.
```

### 10.2 Disclaimer 模板

```text
This tool is for planning and educational use. Platform interfaces, device previews, and image requirements can change. Always verify final uploads in the target platform before publishing or printing.
```

### 10.3 隐私提示模板

```text
Your image stays in your browser. We do not upload or store your file.
```

---

## 11. SEO 实施计划

### 11.1 Metadata

每页必须配置：

- title
- description
- alternates.canonical
- openGraph title
- openGraph description
- openGraph url
- openGraph images
- twitter card
- robots

Title 模板：

```text
{Tool Name} - Free Image Size Tool | Ymir Print
```

Description 模板：

```text
Calculate {main task}, preview safe zones, copy dimensions, and download transparent overlays. Your image stays in your browser.
```

### 11.2 FAQ Schema

每页 4–6 个 FAQ。避免每页重复。

使用 JSON-LD：

```ts
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

### 11.3 Breadcrumb Schema

每页加入：

```ts
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### 11.4 Sitemap

`app/sitemap.ts` 加入：

```text
/image-size
/image-size/aspect-ratio-calculator
/image-size/print-size-calculator
/image-size/dpi-calculator
/image-size/cm-to-pixels
/image-size/a4-size-in-pixels
/image-size/youtube-banner-safe-area
/image-size/youtube-thumbnail-safe-zone
/image-size/short-video-safe-zone
/image-size/linkedin-banner-size
/image-size/x-header-size
```

每项包含：

- url
- lastModified
- changeFrequency
- priority

### 11.5 Robots

确认未封禁：

```text
/image-size/*
```

### 11.6 禁止项

禁止：

- meta keywords
- 关键词堆砌
- 复制平台文档大段原文
- 所有页面相同 FAQ
- 无工具的薄页面
- 只用 Canvas 无可索引文本
- 广告压住首屏工具

---

## 12. AdSense 与 Affiliate 计划

### 12.1 AdSense 位置

允许：

- 结果区之后
- FAQ 中段
- 右侧栏
- 相关工具区下方
- 页面长说明段落之间

禁止：

- Calculate 按钮上下 120px 内
- Download PNG / SVG 按钮附近
- 上传拖拽区域旁边
- overlay 预览中央
- 复制按钮附近
- 用广告把移动端输入区挤出首屏
- 用 “Download” “Start” “Continue” 这类误导性广告标签

广告标签只用：

```text
Advertisement
Sponsored Links
```

### 12.2 Affiliate 位置

适合放在“Next steps”或“Recommended tools”区域。

可承接：

- Canva
- Adobe Express
- Figma templates
- stock image marketplaces
- print services
- poster / business card printing
- social media scheduling tools
- product photography tools
- Shopify apps
- marketplace seller tools

要求：

- 明确 affiliate disclosure。
- 不把 affiliate 当作官方要求。
- 不干扰核心工具。
- 不靠近下载按钮。

---

## 13. Analytics 事件计划

只采集非敏感事件。

### 13.1 事件列表

```text
image_tool_loaded
image_tool_calculated
image_tool_preset_selected
image_tool_local_image_selected
image_tool_overlay_downloaded
image_tool_result_copied
image_tool_risk_warning_shown
image_tool_related_clicked
image_tool_affiliate_clicked
```

### 13.2 属性

```text
tool_id
page_slug
platform
asset_type
input_width
input_height
target_width
target_height
dpi
unit
risk_level
has_uploaded_image
download_type
source_confidence
```

### 13.3 禁止采集

禁止：

- 文件名
- 图片内容
- 本地路径
- 用户输入的自由文本
- 可能识别个人身份的信息

---

## 14. 测试计划

### 14.1 单元测试

测试文件：

```text
src/lib/image-tools/__tests__/aspectRatio.test.ts
src/lib/image-tools/__tests__/dpi.test.ts
src/lib/image-tools/__tests__/paperSize.test.ts
src/lib/image-tools/__tests__/cropFit.test.ts
src/lib/image-tools/__tests__/megapixel.test.ts
```

测试用例：

```text
Aspect ratio:
- 1920×1080 = 16:9
- 1080×1920 = 9:16
- 1080×1350 = 4:5
- 1200×627 ≈ 1.91:1
- 1000×1500 = 2:3

DPI:
- 10cm at 300DPI ≈ 1181px
- 3000px at 300DPI = 10in
- 3000px at 300DPI = 25.4cm
- 210mm at 300DPI ≈ 2480px
- 297mm at 300DPI ≈ 3508px

Paper:
- A4 300DPI portrait ≈ 2480×3508
- A4 300DPI landscape ≈ 3508×2480
- A4 + 3mm bleed = 216×303mm

Megapixel:
- 5000×5000 = 25MP
- 4000×4000 = 16MP
```

### 14.2 组件测试

如果项目已有测试框架，则覆盖：

- Calculator 输入变化后结果更新。
- Copy button 可复制。
- SafeZoneCanvas 能渲染 zones。
- UploadPreview 能读取尺寸。
- OverlayDownloadButtons 能生成下载文件。

### 14.3 手工 QA

逐页检查：

- 移动端首屏能看到工具。
- 图片上传不触发网络请求。
- overlay PNG/SVG 下载尺寸正确。
- 下载按钮附近无广告。
- 每页有 canonical。
- sitemap 有新页面。
- 没有 meta keywords。
- FAQ 不重复。
- Source note 显示 lastCheckedAt。
- estimated safe zone 有风险说明。
- 404 不出现。
- 深色/浅色模式若存在，颜色可读。

### 14.4 构建检查

运行：

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

若项目没有 `typecheck`，则运行实际存在的检查脚本，不强行新增复杂 CI。

---

## 15. 实施阶段计划

### Phase 0：源码审计与保护构建

目标：确认现状，避免重复开发和浪费构建额度。

任务：

1. 获取 `whywbhydyq/print-ready-tool-site` main 最新 SHA。
2. 检查项目结构。
3. 检查现有路由。
4. 检查 AdSense / sitemap / robots / canonical。
5. 检查 `vercel.json` 是否已有 `ignoreCommand`。
6. 若缺失，准备加入 `scripts/skip-old-vercel-builds.mjs`。
7. 确认构建命令。
8. 确认部署状态。

输出：

- 审计记录。
- 最终路径决策。
- 是否需要添加 ignoreCommand。
- P0 文件修改清单。

验收：

- 不开始写页面前已明确项目结构。
- 不创建重复路由。
- 不破坏现有 AdSense / sitemap。
- 明确 GitHub / Vercel / Production 三种状态。

---

### Phase 1：数据层与计算库

目标：先打基础，不先堆页面。

任务：

1. 新增类型定义。
2. 新增 `imageSpecs.ts`。
3. 新增 `paperSpecs.ts`。
4. 新增 `dpiPresets.ts`。
5. 新增 `toolPages.ts`。
6. 新增计算库：
   - aspectRatio
   - dpi
   - printSize
   - paperSize
   - cropFit
   - megapixel
   - overlay helper
7. 新增单元测试。

输出：

- 数据层可复用。
- 所有 P0 页面共享规格数据。
- 核心公式测试通过。

验收：

- 计算测试全部通过。
- P0 specs 有 sourceConfidence。
- P0 specs 有 lastCheckedAt。
- 无页面硬编码重复规格。

---

### Phase 2：核心组件

目标：建立工具页复用组件。

任务：

1. `ToolPageHeader`
2. `SpecResultCard`
3. `RiskBadge`
4. `CopyButton`
5. `ImageUploadPreview`
6. `SafeZoneCanvas`
7. `OverlayDownloadButtons`
8. `SourceNote`
9. `RelatedTools`
10. `ToolFaq`

输出：

- 页面开发可快速拼装。
- 交互逻辑集中。
- 上传与下载功能复用。

验收：

- 本地图片预览可用。
- SafeZoneCanvas 可显示 px / percent zones。
- Overlay SVG / PNG 下载可用。
- object URL 正确 revoke。
- 组件移动端可用。

---

### Phase 3：P0 前 5 个 Print / DPI 页面

目标：先上线最贴合 print 站主题的基础工具。

页面：

1. `/image-size`
2. `/image-size/aspect-ratio-calculator`
3. `/image-size/print-size-calculator`
4. `/image-size/dpi-calculator`
5. `/image-size/cm-to-pixels`
6. `/image-size/a4-size-in-pixels`

任务：

- 页面内容
- metadata
- FAQ
- related tools
- source notes
- sitemap

验收：

- 所有页面有实际工具。
- 所有页面进入 sitemap。
- 每页可复制结果。
- A4 / DPI 计算正确。
- 页面和 print 主题强相关。

---

### Phase 4：P0 平台安全区页面

目标：上线安全区差异化工具。

页面：

1. `/image-size/youtube-banner-safe-area`
2. `/image-size/youtube-thumbnail-safe-zone`
3. `/image-size/short-video-safe-zone`
4. `/image-size/linkedin-banner-size`
5. `/image-size/x-header-size`

任务：

- 使用 `imageSpecs`
- 使用 SafeZoneCanvas
- 使用 ImageUploadPreview
- 使用 OverlayDownloadButtons
- 写清来源等级
- 写清 estimated / conservative risk notes

验收：

- YouTube banner overlay 正确。
- YouTube thumbnail timer zone 正确。
- Short video safe zone 有估算说明。
- LinkedIn 区分 Page cover / URL post。
- X header 上下 60px zone 正确。
- overlay 下载按钮附近无广告。

---

### Phase 5：SEO / AdSense / 法务完善

任务：

1. sitemap 完整。
2. canonical 完整。
3. FAQ schema。
4. breadcrumb schema。
5. OG image。
6. 页面间内链。
7. 页脚入口。
8. Privacy / Disclaimer 更新。
9. AdSense 放置。
10. Affiliate disclosure 预留。

验收：

- 无 meta keywords。
- 广告不干扰工具。
- 法务页面可访问。
- 隐私说明覆盖本地图片预览。
- 平台商标没有暗示官方合作。

---

### Phase 6：构建、提交、部署验证

任务：

1. 运行 lint / typecheck / build。
2. 修复构建错误。
3. 使用批量 GitHub API 提交：
   - create_blob
   - create_tree
   - create_commit
   - update_ref
4. 检查 GitHub main 最新 commit。
5. 检查 Vercel 是否触发构建。
6. 若构建被 rate limit，不继续堆无意义提交；保留 GitHub 已提交状态。
7. 等构建可用后检查 Production。
8. 线上验证页面。

验收：

- GitHub main 有 commit。
- Vercel 构建状态明确。
- Production 状态明确。
- 线上域名状态明确。
- sitemap 可访问。
- 新页面可访问。

---

## 16. 文件修改预测

实际以审计为准。预期新增或修改：

```text
vercel.json
scripts/skip-old-vercel-builds.mjs

src/data/image-tools/imageSpecs.ts
src/data/image-tools/paperSpecs.ts
src/data/image-tools/dpiPresets.ts
src/data/image-tools/toolPages.ts

src/lib/image-tools/aspectRatio.ts
src/lib/image-tools/dpi.ts
src/lib/image-tools/printSize.ts
src/lib/image-tools/paperSize.ts
src/lib/image-tools/cropFit.ts
src/lib/image-tools/megapixel.ts
src/lib/image-tools/overlay.ts
src/lib/image-tools/format.ts

src/components/image-tools/AspectRatioCalculator.tsx
src/components/image-tools/DpiCalculator.tsx
src/components/image-tools/PrintSizeCalculator.tsx
src/components/image-tools/UnitPixelCalculator.tsx
src/components/image-tools/PaperPixelCalculator.tsx
src/components/image-tools/SafeZoneCanvas.tsx
src/components/image-tools/ImageUploadPreview.tsx
src/components/image-tools/OverlayDownloadButtons.tsx
src/components/image-tools/SpecResultCard.tsx
src/components/image-tools/RiskBadge.tsx
src/components/image-tools/SourceNote.tsx
src/components/image-tools/RelatedTools.tsx
src/components/image-tools/ToolPageHeader.tsx
src/components/image-tools/ToolFaq.tsx
src/components/image-tools/CopyButton.tsx

src/app/image-size/page.tsx
src/app/image-size/aspect-ratio-calculator/page.tsx
src/app/image-size/print-size-calculator/page.tsx
src/app/image-size/dpi-calculator/page.tsx
src/app/image-size/cm-to-pixels/page.tsx
src/app/image-size/a4-size-in-pixels/page.tsx
src/app/image-size/youtube-banner-safe-area/page.tsx
src/app/image-size/youtube-thumbnail-safe-zone/page.tsx
src/app/image-size/short-video-safe-zone/page.tsx
src/app/image-size/linkedin-banner-size/page.tsx
src/app/image-size/x-header-size/page.tsx

src/app/sitemap.ts
src/app/layout.tsx
src/app/page.tsx
src/app/privacy-policy/page.tsx
src/app/disclaimer/page.tsx
```

如果项目不使用 `src/`，所有路径改为 `app/`、`components/`、`lib/`、`data/`。

---

## 17. 90 天观察计划

上线后 90 天看数据，不凭感觉继续扩展。

### 17.1 GSC 指标

观察：

- impressions
- clicks
- CTR
- average position
- indexed pages
- query coverage

重点 query：

```text
a4 size in pixels
a4 300 dpi pixels
cm to px
px to cm
dpi calculator
print size calculator
aspect ratio calculator
youtube banner safe area
youtube thumbnail safe zone
tiktok safe zone
linkedin banner size
x header size
```

### 17.2 产品事件

观察：

- calculated rate
- image upload local rate
- overlay download rate
- copy result rate
- related tool click rate
- average engagement time

### 17.3 扩展条件

满足以下条件再做 P1：

- P0 页面至少 70% 被索引。
- 至少 3 个页面有稳定 impressions。
- 工具交互率高于 8%。
- overlay 下载事件存在真实量。
- 用户不是只看首屏答案就走。
- 规格维护成本低于每周 3 小时。

### 17.4 止损条件

若出现以下情况，停止扩展：

- 90 天 P0 总 impressions 低于 1,000。
- 工具交互率低于 5%。
- overlay 几乎无人下载。
- 用户只看尺寸不使用工具。
- 规格维护成本明显高于收益。
- 页面被判定低价值或索引困难。

---

## 18. 风险与应对

### 18.1 平台规格变化

风险：平台更新尺寸、安全区、UI。

应对：

- 数据集中管理。
- 每条数据有 `lastCheckedAt`。
- 每条数据有 `sourceConfidence`。
- 每季度复核 P0 规格。
- 对不确定区域写 conservative reference。

### 18.2 SEO 被强站压制

风险：Canva、Adobe、Buffer 等占据大词。

应对：

- 不抢泛大词。
- 做交互工具和 overlay。
- 长尾切入。
- 与 print / DPI / bleed 强绑定。
- 每页有独特功能，而不是尺寸表。

### 18.3 AdSense 误点风险

风险：下载按钮、上传区、预览区附近广告导致误点。

应对：

- 广告远离交互。
- 明确广告标签。
- 移动端不压首屏工具。
- 不把广告伪装成结果或下载。

### 18.4 准确性责任

风险：safe zone 不可能适配所有设备、app 版本、地区。

应对：

- 官方和估算分开。
- 使用 conservative language。
- 不承诺 100%。
- 鼓励最终上传前在平台内预览。

### 18.5 性能风险

风险：Canvas、图片预览、overlay 下载导致 JS 变重。

应对：

- 页面 server component + 交互组件 client component。
- 不引入重型图片编辑库。
- 懒加载非首屏组件。
- 不内联大 base64 图片。
- 本地预览限制最大图片提示。

---

## 19. 给执行 AI 的实施提示词

```text
你现在负责在仓库 whywbhydyq/print-ready-tool-site 中实施“第四项目：图像尺寸、比例、DPI 与安全区工具矩阵”。

执行规则：
1. 先审计源码，不要直接写页面。
2. 确认 App Router / Pages Router、现有路由、sitemap、robots、metadata、AdSense、vercel.json。
3. 检查 vercel.json 是否已有 ignoreCommand。若没有，加入 scripts/skip-old-vercel-builds.mjs，跳过旧 commit 构建。
4. P0 只做 10 个页面：
   - /image-size
   - /image-size/aspect-ratio-calculator
   - /image-size/print-size-calculator
   - /image-size/dpi-calculator
   - /image-size/cm-to-pixels
   - /image-size/a4-size-in-pixels
   - /image-size/youtube-banner-safe-area
   - /image-size/youtube-thumbnail-safe-zone
   - /image-size/short-video-safe-zone
   - /image-size/linkedin-banner-size
   - /image-size/x-header-size
5. 不做图片编辑器、不做 AI 出图、不做登录、不做云端保存、不上传图片服务器。
6. 图片只允许浏览器本地预览。
7. 规格数据必须集中管理，并带 sourceConfidence、sourceUrl、lastCheckedAt。
8. 每页必须有工具、结果卡片、FAQ、相关工具内链、来源说明、canonical、sitemap。
9. 不添加 meta keywords。
10. AdSense 不得靠近输入、上传、复制、下载、overlay 预览区域。
11. 同一阶段改动先全部完成并检查，再用 create_blob → create_tree → create_commit → update_ref 一次性提交。
12. 完成后区分 GitHub 提交、Vercel 触发、Production 部署、线上域名状态。
```

---

## 20. 最终验收清单

### 产品

- [ ] `/image-size` 聚合页完成。
- [ ] 10 个 P0 页面完成。
- [ ] 每页有真实工具。
- [ ] 每页可复制结果。
- [ ] 安全区页面可下载 PNG/SVG overlay。
- [ ] 图片上传仅本地处理。
- [ ] 上传区有隐私提示。
- [ ] estimated safe zone 有说明。
- [ ] 平台规格有来源等级。

### 技术

- [ ] 数据层集中。
- [ ] 计算库有测试。
- [ ] 页面 server component 优先。
- [ ] 交互组件 client component。
- [ ] object URL 正确 revoke。
- [ ] 无重型图片编辑依赖。
- [ ] lint 通过。
- [ ] typecheck 通过。
- [ ] build 通过。

### SEO

- [ ] 每页 title / description。
- [ ] 每页 canonical。
- [ ] 每页进入 sitemap。
- [ ] 每页 FAQ schema。
- [ ] 每页 breadcrumb。
- [ ] 无 meta keywords。
- [ ] 有相关工具内链。
- [ ] 有可索引正文。

### AdSense / 合规

- [ ] 广告不挡工具。
- [ ] 广告不靠近下载按钮。
- [ ] 广告不伪装成内容。
- [ ] Privacy / Disclaimer 覆盖本地图片预览。
- [ ] 不暗示与平台官方合作。
- [ ] affiliate 有 disclosure。

### 部署

- [ ] GitHub main 已提交。
- [ ] Vercel 构建状态明确。
- [ ] Production 部署状态明确。
- [ ] 线上页面可访问。
- [ ] sitemap 可访问。
- [ ] robots 未误封。
- [ ] 线上无明显控制台错误。

---

## 21. 第一轮开发的最小完成定义

第一轮可以判定完成，必须同时满足：

1. 10 个 P0 页面全部可访问。
2. 每个页面都有可交互工具，而不是纯文章。
3. 至少 5 个页面支持本地图片预览或 overlay 下载。
4. Print / DPI / A4 / ratio 计算结果正确。
5. YouTube Banner、YouTube Thumbnail、Short Video、LinkedIn、X 均有可视化安全区或风险区。
6. sitemap、canonical、FAQ、相关内链完成。
7. 无 meta keywords。
8. 广告不干扰核心操作。
9. 构建通过。
10. 已明确 GitHub、Vercel、Production、线上域名状态。

---

## 22. 后续 P1 决策

P0 上线后，优先根据 GSC 和事件数据决定 P1。

若 print/DPI 页面表现更好，优先：

1. Business Card Size in Pixels
2. Photo Print Size Checker
3. Bleed Size Calculator
4. Poster Size in Pixels
5. Image Resolution Checker

若平台安全区页面表现更好，优先：

1. Pinterest Pin Size Checker
2. Instagram Image Without Cropping
3. Universal Social Image Size Recommender
4. Website Banner Crop Preview
5. Open Graph Image Checker

若电商相关 query 出现，优先：

1. Product Image Size Checker
2. Google Shopping Image Size Checker
3. Shopify Image Megapixel Calculator
4. Etsy Listing Image Size
5. Amazon Product Image Size

---

## 23. 结论

本项目的开发重点不是“多做页面”，而是用 10 个 P0 页面验证一个产品假设：

> 用户不只想知道尺寸，他们想在上传或打印前确认图片不会被裁、不会模糊、不会被 UI 挡住，并能直接复制结果或下载安全区 overlay。

若 P0 交互和 GSC 数据成立，再扩展 P1；若 P0 只有浅层答案流量，没有工具交互，则停止扩展，转向优化现有 print 工具或其他项目。
