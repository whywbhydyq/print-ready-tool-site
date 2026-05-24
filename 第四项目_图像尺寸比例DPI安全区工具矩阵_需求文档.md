# 第四项目需求文档：图像尺寸、比例、DPI 与安全区工具矩阵

版本：2026-05-24  
项目归属：`print.ymirtool.com` 扩展模块  
建议英文定位：**Image Size, Print DPI & Safe Zone Tools for Creators**  
建议中文定位：**图片尺寸、打印 DPI、平台安全区与比例换算工具矩阵**  
文档用途：用于后续生成 PRD、开发计划、页面清单、数据结构、测试用例与 SEO 内容计划。

---

## 0. 一句话结论

第四项目不应做成“社交媒体图片尺寸大全”这种纯答案页。正确方向是并入 `print.ymirtool.com`，做成一个以 **图片能不能用、会不会被裁、会不会模糊、能打印多大、关键内容会不会被平台 UI 挡住** 为核心的轻量工具矩阵。

用户真正要解决的问题不是“某个平台尺寸是多少”，而是：

- 我这张图上传后会不会被裁？
- 我的文字、logo、人物脸、商品主体会不会被挡住？
- 这张图能不能打印 A4 / 海报 / 名片？
- DPI、PPI、像素、厘米、英寸到底怎么换算？
- 同一张图能不能用于 YouTube、TikTok、Instagram、LinkedIn、X、Pinterest？
- 我需要下载什么安全区模板或透明 overlay？
- 平台规格变了之后，哪个工具是最新可信的？

因此，本项目应以 **计算 + 预览 + overlay 下载 + 风险提示 + 简明解释** 作为核心，不以堆表格为主。

---

## 1. 项目背景与来源

### 1.1 来自原始选题底稿的定位

原始底稿将第四项目定义为：

> 图像尺寸与比例矩阵，并入 `print.ymirtool.com` 扩展。  
> 目标用户包括设计师、社媒运营、创作者、求职者、小商家、印前用户。  
> 核心问题包括不同平台 / 纸张 / 打印尺寸需要多少像素、宽高比怎么换、DPI/PPI 如何影响打印、安全区如何预览。  
> 核心功能包括 Aspect ratio calculator、cm/mm/in ↔ px、DPI/PPI、A 系列纸张像素、LinkedIn / YouTube / Instagram / TikTok / X 尺寸和安全区预览、透明 overlay 下载。

原始底稿同时指出该方向的最脆弱点是：**答案型流量容易被 AI 和强内容站截流**。所以本项目必须避免只做“尺寸表”，必须做可交互工具。

### 1.2 为什么并入 print.ymirtool.com，而不是单独开站

不建议单独新开主站，原因如下：

1. 图像尺寸与 DPI / 打印尺寸天然和印前检查相关。
2. `print.ymirtool.com` 已经具备印前、DPI、PDF、bleed、安全边距等语义基础。
3. 单独做“social image sizes”会直面 Canva、Adobe、Buffer、Hootsuite、Sprout、Later 等强站。
4. 并入 print 站可以形成更清晰的垂直定位：图片从屏幕发布到打印输出都能检查。
5. 对 AdSense 审核和内容厚度而言，工具矩阵比单点尺寸页更有内容价值。

### 1.3 项目边界

本项目第一版不是：

- 图片编辑器
- AI 出图工具
- Canva 替代品
- Photoshop 替代品
- 大型在线压缩工具
- 社媒排程工具
- 云端文件管理工具
- 视频编辑器
- 设计素材站

本项目第一版是：

- 图片尺寸换算工具
- 打印尺寸 / DPI 判断工具
- 平台尺寸查询工具
- 安全区 overlay 生成工具
- 本地图片预览工具
- 裁切风险提示工具
- 长尾 SEO 工具页面矩阵

---

## 2. 用户真实需求研究

### 2.1 用户需求的核心变化

表面需求是“查尺寸”。真实需求是“避免失败”。

| 表面搜索词 | 背后真实需求 | 工具价值 |
|---|---|---|
| YouTube banner size | 为什么手机端只显示中间一条？ | 多设备裁切预览 |
| YouTube thumbnail size | 文字会不会被右下角时间条挡住？ | 时间条 overlay |
| TikTok safe zone | 按钮、caption、CTA 会不会挡住内容？ | UI 安全区预览 |
| LinkedIn banner size | 公司封面或求职 banner 会不会被裁？ | 安全区和设备提示 |
| X header size | 1500×500 为什么仍然上下裁掉？ | 60px 裁切风险区 |
| A4 size in pixels | 我该建多少像素画布？ | DPI + 纸张换算 |
| 300 DPI calculator | 我的图够不够清晰打印？ | 清晰度等级判断 |
| cm to px | 打印 / 设计软件中如何换算？ | 双向单位换算 |
| resize without cropping | 不想裁掉人物或商品主体 | padding / fit 方案 |
| image size for Google Shopping | 商品图是否会被拒？ | 电商图片合规检查 |

### 2.2 用户类型

#### A. 创作者 / YouTuber / 视频号运营者

目标：上传 banner、thumbnail、shorts/reels/tiktok 封面时不被裁、不被遮挡。

典型问题：

- 我按 2560×1440 做了 YouTube banner，为什么手机端只显示一小条？
- YouTube thumbnail 右下角会不会挡住文字？
- TikTok / Reels / Shorts 能不能共用一个 9:16 封面？
- 竖屏视频用 16:9 缩略图为什么在手机首页被替换？
- 有没有透明安全区 overlay 可以放到 Canva / Figma / Photoshop 里？

#### B. 社媒运营 / 小商家 / 自由职业者

目标：减少一张图改成多个平台尺寸的重复劳动。

典型问题：

- 一张图能不能同时发 Instagram、Facebook、LinkedIn、X？
- 通用比例选 1:1、4:5 还是 9:16？
- LinkedIn 公司主页封面为什么移动端裁切不同？
- Pinterest 2:3 是不是最好？
- 小红书封面 3:4、1:1、4:3 到底选哪个？

#### C. 设计师 / 印前用户 / 学生

目标：把像素、DPI、厘米、英寸、A4、海报、名片这些概念正确换算。

典型问题：

- A4 300DPI 是多少像素？
- 72DPI 的图片能不能打印？
- 1920×1080 的图能印多大？
- px 怎么换 cm？
- 我只改 DPI 标签，图片会不会变清晰？
- 为什么打印出来被裁边？
- bleed 和 safe margin 需要多少？

#### D. 电商卖家 / 商品图运营

目标：让商品图满足 Google Merchant、Pinterest、Shopify 等平台的最低要求，并减少被拒或显示不佳。

典型问题：

- Google Shopping 主图最低多少像素？
- 图片超过 16MB 或 64MP 会不会有问题？
- Shopify 为什么提示图片太大，明明 MB 不大？
- 商品主体占画面太小会不会影响展示？
- 服装图片裁掉模特头脚是否有风险？

#### E. App 开发者 / 独立开发者 / ASO 运营

目标：准备 Google Play、App Store 的图像资产和截图。

典型问题：

- Google Play icon 是多少尺寸？
- Feature graphic 是多少尺寸？
- App Store 6.9 inch、6.5 inch、iPad 截图怎么准备？
- 哪些截图可以复用，哪些必须单独做？
- 截图上的文字太小会不会看不清？

---

## 3. 官方规格与事实基线

平台规格会变化，所以项目必须有 `lastCheckedAt` 字段和来源标记。以下只作为 2026-05-24 版本的初始事实基线。

### 3.1 YouTube

#### YouTube banner / channel art

Adobe Express 的 YouTube 尺寸指南列出：

- 理想尺寸：2560×1440
- 所有设备安全区：中心 1546×423
- Mobile display：1546×423
- Tablet display：1855×423
- Desktop：2560×423
- TV display：2560×1440
- 文件类型：JPG、GIF、BMP、PNG
- 文件大小：不大于 6MB

产品含义：

- 页面不能只显示 2560×1440。
- 必须显示不同设备可见区域。
- 必须提供 1546×423 中央安全区 overlay。
- 结果里应解释：尺寸正确不代表所有内容都可见。

#### YouTube thumbnail

YouTube Help 当前建议自定义 thumbnail：

- 尽可能高分辨率。
- 推荐 3840×2160。
- 最小宽度 640px。
- JPG / GIF / PNG。
- 移动端上传限制：video thumbnails 2MB。
- 桌面端上传限制：video thumbnails 50MB。
- 建议使用 16:9。
- 竖屏视频的 16:9 custom thumbnail 在 home、explore、subscriptions 等移动页面可能会被自动生成的 4:5 thumbnail 替换。

产品含义：

- 可以保留用户熟悉的 1280×720 作为常见 preset，但主文案必须说明官方当前建议更高分辨率。
- 必须提供 16:9、4:5、9:16 相关提醒。
- YouTube Shorts 的缩略图不能按普通长视频 thumbnail 完全处理。

### 3.2 TikTok

TikTok Ads Manager 对 Non-Spark Ads 给出：

- Vertical 推荐 9:16，至少 540×960。
- Horizontal 16:9，至少 960×540。
- Square 1:1，至少 640×640。
- 文件格式支持 mp4、mov、mpeg、3gp、avi。
- 文件大小不超过 500MB。
- safe zone 取决于尺寸方向、caption 长度、附加格式。
- TikTok 提供 LTR 和 Arabic RTL 安全区文件。
- Profile photo：98×98，关键元素应放在中心 66×66，避免裁切。

产品含义：

- TikTok 页面必须以安全区为核心，而不是只给 1080×1920。
- 需要 caption 长度模式。
- 后续可做 LTR / RTL 切换。
- Profile photo 可以作为小工具或 FAQ 补充。

### 3.3 LinkedIn

LinkedIn Help 当前列出：

- Page Logo 推荐 400×400，最大 3MB，PNG/JPEG。
- Page Cover image 推荐 4200×700。
- Life Main image 推荐 1128×376。
- Life Company photos 推荐 900×600。
- URL post image 推荐 1.91:1，即 1200×627。
- LinkedIn 明确提示：cover image 可能因设备和屏幕尺寸被水平或垂直裁切，关键细节应远离边缘，尤其是 lower-right corner。

产品含义：

- LinkedIn 页面必须有“设备裁切”和“右下角风险”提示。
- 不能只给 1584×396 这种个人资料旧常见尺寸；需要区分个人 profile banner、Page cover、Company Page、URL post。
- 第一版优先做 Page cover 和 URL post，个人 profile banner可作为 P1 扩展。

### 3.4 X / Twitter

X Help 当前说明：

- Profile image 推荐 400×400。
- Header image 推荐 1500×500。
- Profile photos 最大 2MB。
- 即使使用推荐尺寸，header 在不同显示器和浏览器上仍可能被裁切，上下各约 60px 可能被裁。

产品含义：

- X header 页面必须提供 top/bottom 60px 风险区。
- 必须说明 1500×500 不等于全区域必定可见。
- 可以附带头像遮挡预览，但需要以后用截图实测位置或社区观测值，不要伪装成官方精确值。

### 3.5 Pinterest

Pinterest Business Help 当前说明：

- Standard image ads 推荐 2:3 或 1000×1500。
- 大于 2:3 的比例可能在 feed 中被裁。
- PNG/JPEG。
- Desktop 最大 20MB，App 内最大 32MB。
- Title 最多 100 字，但不同设备可能只显示前 40 个字符。
- 中文、日文、韩文、阿拉伯等双字节语言可能只显示前 30 个字符。
- Idea ads 推荐 1080×1920，9:16。
- Pinterest 还对部分广告格式给出明确 safe zones。

产品含义：

- Pinterest 页面应强调 2:3 和 feed 裁切，而不是只做尺寸表。
- 可以做 title preview 或标题长度提醒。
- 中文双字节字符长度是一个差异化细节。

### 3.6 Google Merchant / Google Shopping

Google Merchant Center Help 当前说明：

- 2027-01-31 起，所有产品图片至少 500×500。
- Google 建议提供 1500×1500 或以上，以获得更好的展示表现。
- 图片不得大于 64MP。
- 图片文件不得大于 16MB。
- 图片必须准确显示完整产品，不能模糊，不能裁切不完整。
- 对服装类产品，全身图避免裁掉模特头或脚。
- 产品主体建议占画面 75%–90%。

产品含义：

- 这是 P1 中最有商业邻接价值的扩展。
- 可以做 Product Image Readiness Checker。
- 第一版不能自动识别主体占比，但可以做像素、MP、文件大小、格式、清单式自检。
- 自动识别商品是否被裁属于 P2 或 P3，不作为 MVP。

### 3.7 Shopify

Shopify Help 当前说明：

- 图片上传受 megapixels 和 file size 双重限制。
- 图片不能超过 20MP。
- 图片不能超过 20MB。
- megapixels 公式为 `(pixel width × pixel height) / 1,000,000`。
- 有时 MB 小但仍被拒，是因为 megapixel count 超过限制。

产品含义：

- 必须做 Image Megapixel Calculator。
- 商品图 / 网站图上传失败解释页有真实需求。
- Shopify banner 响应式裁切可以作为后续 P1/P2 页面。

### 3.8 Google Play

Google Play Help 当前说明：

- App icon 必须为 32-bit PNG with alpha。
- Icon 尺寸 512×512。
- 最大文件大小 1024KB。
- Feature graphic 必须提供，JPEG 或 24-bit PNG no alpha。
- Feature graphic 尺寸 1024×500。
- Feature graphic 应把关键视觉放在中心，避免 cutoff zones。
- Screenshots 可上传到不同设备类型，至少要提供 2 张，支持 JPEG 或 24-bit PNG no alpha。
- Screenshot 最小 dimension 320px，最大 dimension 3840px，最大边不能超过最小边 2 倍。
- Google Play 对截图文本、CTA、排名宣传、过期信息等有内容限制。

产品含义：

- Google Play asset checker 是 P2，不作为第一版核心。
- 但独立开发者群体与 ymirtool 用户可能重叠，后续值得做。

### 3.9 App Store

Apple App Store Connect 的 screenshot specifications 页面列出大量设备截图尺寸。当前包括：

- 必须上传 1–10 张截图。
- 支持 `.jpeg`、`.jpg`、`.png`。
- iPhone 6.9" display 接受 1260×2736、1290×2796、1320×2868 等 portrait 尺寸，也接受对应 landscape 尺寸。
- 6.5"、6.3"、6.1"、5.5"、4.7"、4" 等设备尺寸有不同截图规格。
- 没有合格尺寸时，部分设备会使用其他显示尺寸截图缩放。

产品含义：

- App Store 页面维护成本高，因为设备列表长且会随新机型变化。
- 建议 P2 做“链接式矩阵 + 复用规则 + 快速筛选”，不作为第一阶段。

---

## 4. 产品定位

### 4.1 英文主定位

**Check image sizes, print DPI, aspect ratios, and safe zones before uploading or printing.**

### 4.2 中文主定位

**上传或打印前，检查图片尺寸、DPI、比例和安全区，避免被裁、变糊、挡住或被平台拒绝。**

### 4.3 核心差异化

与普通尺寸文章相比：

- 普通文章：告诉你尺寸。
- 本工具：告诉你当前图片能不能用，哪里会被裁，哪里会被挡，应该导出什么尺寸。

与 Canva / Adobe 相比：

- Canva / Adobe：引导你进入编辑器。
- 本工具：快速计算、预览、下载 overlay，不要求登录，不要求上传服务器，不保存图片。

与图片压缩站相比：

- 压缩站：处理文件。
- 本工具：判断规格、比例、安全区、打印适配。

与 AI 回答相比：

- AI：能解释尺寸，但不能稳定提供即时 overlay、设备裁切图、本地预览、复制结果、下载模板。
- 本工具：提供确定性的交互和可视化。

---

## 5. 成功标准

### 5.1 产品成功标准

用户进入页面后，应能在 30 秒内得到明确判断：

- 当前图片适合哪个用途。
- 当前图片哪里有裁切或遮挡风险。
- 当前图片若用于打印，最大清晰打印尺寸是多少。
- 当前图片需要导出成什么尺寸。
- 是否可以下载安全区 overlay 或空白模板。

### 5.2 SEO 成功标准

90 天内：

- P0 页面全部索引。
- `A4 size in pixels`、`cm to px`、`DPI calculator`、`YouTube banner safe area`、`X header safe zone` 等长尾页面开始获得 impressions。
- 工具按钮点击率高于 8%。
- 平均停留时间高于纯答案页。
- 至少 30% 页面有工具交互事件。

### 5.3 商业成功标准

初期以 AdSense 为主，affiliate 为辅。

可验证指标：

- 广告不干扰核心输入。
- 结果区下方广告曝光稳定。
- Canva / Adobe Express / Figma templates / stock assets / social scheduling / print services 等 affiliate 点击有自然承接。
- 对电商图片检查页面，可承接 Shopify / 商品摄影 / seller tools / feed tools 相关 affiliate。

---

## 6. MVP 范围

### 6.1 第一版必须做的 10 个页面

#### 1. Aspect Ratio Calculator

目标：解决比例、等比缩放、裁切适配。

功能：

- 输入 width / height。
- 自动计算 ratio。
- 支持常见比例：1:1、4:5、3:4、16:9、9:16、1.91:1、2:3、3:2。
- 输入目标宽度，计算目标高度。
- 输入目标高度，计算目标宽度。
- 判断当前比例与目标比例差异。
- 显示裁切或 padding 方案。
- 支持复制结果。

#### 2. Print Size Calculator

目标：判断图片能以什么尺寸打印。

功能：

- 输入像素宽高。
- 输入 DPI/PPI。
- 输出最大打印尺寸：inch / cm / mm。
- 输出清晰度评级：High / Acceptable / Low / Not recommended。
- 常见 DPI 预设：72、96、150、200、300、600。
- 支持 A4、A5、A3、Letter、Poster、Business Card 预设。
- 解释 DPI 标签与真实像素的区别。

核心公式：

```text
print_width_in = pixel_width / ppi
print_height_in = pixel_height / ppi
print_width_cm = print_width_in * 2.54
print_height_cm = print_height_in * 2.54
```

#### 3. DPI / PPI Calculator

目标：解释并计算 DPI/PPI。

功能：

- 根据像素和物理尺寸计算 PPI。
- 根据物理尺寸和目标 PPI 计算所需像素。
- 支持 inch、cm、mm。
- 提示“改 DPI 标签不会凭空增加图片细节”。
- 提供 72/96/150/300/600 对比表。

核心公式：

```text
ppi = pixels / inches
pixels = inches * ppi
cm = inches * 2.54
pixels_per_cm = ppi / 2.54
```

#### 4. CM to Pixels Calculator

目标：单位换算。

功能：

- cm → px。
- px → cm。
- mm → px。
- px → mm。
- inch → px。
- px → inch。
- DPI/PPI 可输入。
- 常用预设：72、96、150、300、600。
- 结果四舍五入，并显示精确值。

#### 5. A4 Size in Pixels

目标：吃稳定长尾，同时与 print 站高度相关。

功能：

- A4 at 72 / 96 / 150 / 300 / 600 DPI 像素表。
- Portrait / landscape 切换。
- 支持 A0–A6。
- 支持 US Letter / Legal。
- 显示出血版尺寸：默认 3mm bleed，可自定义。
- 显示安全边距：默认 5mm，可自定义。

A4 基准：

```text
A4 = 210mm × 297mm
width_px = width_mm / 25.4 * dpi
height_px = height_mm / 25.4 * dpi
```

#### 6. YouTube Banner Safe Area Tool

目标：解决强痛点“尺寸对了但设备显示不对”。

功能：

- 显示 2560×1440 画布。
- 显示 central safe area：1546×423。
- 显示 mobile、tablet、desktop、TV 可见区域。
- 支持上传本地图预览，不上传服务器。
- 支持 overlay 下载：PNG / SVG。
- 支持复制尺寸。
- 提示 logo、文字、人物脸、CTA 应放在中心安全区。
- 提供 Canva / Photoshop / Figma 使用说明。

#### 7. YouTube Thumbnail Safe Zone

目标：解决缩略图比例、时间条遮挡、竖屏视频差异。

功能：

- 显示官方当前建议：3840×2160，16:9。
- 保留常见 preset：1280×720、1920×1080、3840×2160。
- 显示右下角 timer badge 风险区。
- 提醒竖屏视频在移动首页可能使用自动 4:5 thumbnail。
- 支持上传预览。
- 支持 16:9 / 4:5 对比。
- 支持 overlay 下载。

#### 8. Short Video Safe Zone Overlay

覆盖：TikTok、Instagram Reels、YouTube Shorts。

功能：

- 9:16 画布。
- 常见 preset：1080×1920、720×1280、540×960。
- TikTok 官方最低 540×960 提示。
- 显示右侧按钮区、底部 caption 区、顶部 UI 区。
- 支持 caption 长度：short / medium / long。
- 支持 LTR / RTL 后续扩展。
- 支持导出 overlay。
- 明确提示：不同平台和设备 UI 存在差异，此工具是安全区参考，不是绝对像素保证。

#### 9. LinkedIn Banner Size & Safe Zone

功能：

- 区分 Page Cover、Page Logo、URL Post Image。
- Page Cover 推荐 4200×700。
- Page Logo 推荐 400×400。
- URL Post Image 推荐 1200×627，1.91:1。
- 显示边缘裁切风险，特别是 lower-right corner。
- 支持上传预览和复制结果。
- 提示 logo 在浅色 / 深色背景下测试。

#### 10. X Header Size Crop Preview

功能：

- Header 推荐 1500×500。
- Profile image 推荐 400×400。
- 显示上下 60px 可能裁切风险区。
- 支持上传预览。
- 支持复制结果。
- 后续可加入头像遮挡区，但 MVP 不把头像遮挡作为官方精确数据展示。

### 6.2 第一版明确不做

- 不做登录。
- 不做云端保存。
- 不上传图片到服务器。
- 不做复杂图片编辑。
- 不做 AI 生成图片。
- 不做批量压缩。
- 不做指定 KB 压缩。
- 不做完整视频编辑。
- 不做自动识别商品主体。
- 不做 OCR 检测文字是否出界。
- 不做所有平台一次性全覆盖。
- 不做无来源尺寸大全。
- 不做 meta keywords。

---

## 7. P1 / P2 扩展范围

### 7.1 P1 页面

1. Pinterest Pin Size Checker  
2. Pinterest 2:3 Ratio Calculator  
3. Product Image Size Checker  
4. Google Shopping Image Size Checker  
5. Shopify Image Megapixel Calculator  
6. Instagram Image Without Cropping  
7. Social Media Image Size Calculator  
8. Universal Social Image Size Recommender  
9. 小红书封面尺寸  
10. 小红书图片不被裁剪  
11. Website Banner Crop Preview  
12. Hero Image Focal Point Preview  
13. Facebook Event Cover Size  
14. Open Graph Image Checker  
15. Business Card Size in Pixels  

### 7.2 P2 页面

1. Google Play App Icon Size  
2. Google Play Feature Graphic Size  
3. Google Play Screenshot Checker  
4. App Store Screenshot Size Matrix  
5. iPhone Screenshot Size Calculator  
6. iPad Screenshot Size Calculator  
7. Etsy Listing Image Size  
8. Amazon Product Image Size  
9. Email Header Image Size  
10. Passport / ID Photo Size Checker  
11. PSD / Figma overlay download hub  
12. Batch Social Media Export Plan  
13. Marketplace Image Compliance Checklist  
14. Multi-language social image sizes  
15. Advanced Safe Zone Database

---

## 8. 信息架构

建议路径结构：

```text
/
  /image-size/
    /aspect-ratio-calculator/
    /print-size-calculator/
    /dpi-calculator/
    /cm-to-pixels/
    /a4-size-in-pixels/
    /youtube-banner-safe-area/
    /youtube-thumbnail-safe-zone/
    /short-video-safe-zone/
    /linkedin-banner-size/
    /x-header-size/
    /pinterest-pin-size/
    /product-image-size-checker/
    /google-shopping-image-size/
    /shopify-image-megapixel-calculator/
    /xiaohongshu-cover-size/
```

若当前 `print.ymirtool.com` 已有相关路径，应优先并入现有分类，避免重复 slug。

站内导航建议：

```text
Print Tools
  - DPI Calculator
  - Print Size Calculator
  - A4 Size in Pixels
  - Bleed Calculator
  - Safe Margin Calculator

Image Size Tools
  - Aspect Ratio Calculator
  - CM to Pixels
  - YouTube Banner Safe Area
  - Short Video Safe Zone
  - LinkedIn Banner Size
  - X Header Size

Product & Platform Image Tools
  - Google Shopping Image Checker
  - Pinterest Pin Size
  - Shopify Image MP Checker
```

---

## 9. 核心功能需求

### 9.1 本地图片预览

要求：

- 通过 browser File API 读取图片。
- 不上传服务器。
- 显示原始 width、height、ratio。
- 显示 megapixels。
- 显示文件大小。
- 显示文件类型。
- 支持 JPG、PNG、WebP、GIF 静态预览。
- 对 SVG 只做基础尺寸读取或提示不支持。
- 对 HEIC 可提示浏览器可能无法读取。

验收标准：

- 用户选择图片后页面不发生网络上传。
- 页面能显示图片自然尺寸。
- 关闭页面后图片不保留。
- 隐私说明明确写在上传按钮附近。

### 9.2 安全区 overlay

要求：

- 使用 SVG 或 Canvas 绘制 overlay。
- 支持多个区域：safe、crop risk、UI obstruction、avatar overlap、caption area、timer badge。
- 每个区域有 label。
- 支持下载 PNG。
- 支持下载 SVG。
- 支持透明背景。
- 支持“只下载 overlay”与“下载带预览背景图”的区分。

验收标准：

- YouTube banner overlay 能显示 full canvas、mobile safe、desktop visible、TV full。
- X header overlay 能显示 top/bottom crop risk。
- TikTok overlay 能显示右侧按钮和底部 caption 风险区。
- 下载后的 overlay 尺寸与推荐画布尺寸一致。

### 9.3 裁切 / padding 建议

输入：

- 当前图片尺寸。
- 目标比例。
- 用户偏好：crop / fit with padding / fill / keep original。

输出：

- 目标尺寸。
- 裁切区域。
- 被裁百分比。
- padding 区域大小。
- 推荐方案。

公式：

```text
source_ratio = source_width / source_height
target_ratio = target_width / target_height

if source_ratio > target_ratio:
    crop_width = source_height * target_ratio
    crop_height = source_height
else:
    crop_width = source_width
    crop_height = source_width / target_ratio
```

### 9.4 打印尺寸判断

输入：

- 像素宽高。
- 目标 DPI。
- 目标纸张或自定义尺寸。
- 是否需要 bleed。
- 是否需要 safe margin。

输出：

- 最大打印尺寸。
- 对目标纸张是否足够。
- 所需像素。
- 缺口百分比。
- 清晰度等级。
- 解释文本。

清晰度建议：

| PPI | 评级 | 说明 |
|---|---|---|
| >= 300 | High | 常规高质量印刷 |
| 200–299 | Good / Acceptable | 多数普通打印可接受 |
| 150–199 | Low risk / Distance-dependent | 远看可能可用，近看风险高 |
| < 150 | Not recommended | 近距离观看明显模糊风险 |

### 9.5 规格数据库

不要把规格写死在组件里。建议建立统一数据结构。

TypeScript 示例：

```ts
export type SourceConfidence = "official" | "strong-secondary" | "community-observed" | "internal-estimate";

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
  maxMegapixels?: number;
  aspectRatio?: string;
  supportedFormats?: string[];
  safeZones?: SafeZone[];
  cropRiskZones?: SafeZone[];
  uiObstructionZones?: SafeZone[];
  deviceVariants?: DeviceVariant[];
  notes: string[];
  officialSourceUrl?: string;
  sourceConfidence: SourceConfidence;
  lastCheckedAt: string;
  relatedTools: string[];
  priority: "P0" | "P1" | "P2";
};

export type SafeZone = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "px" | "percent";
  severity: "safe" | "warning" | "danger" | "info";
};

export type DeviceVariant = {
  id: string;
  label: string;
  visibleWidth: number;
  visibleHeight: number;
  x?: number;
  y?: number;
  notes?: string;
};
```

---

## 10. 页面模板

每个工具页统一结构：

1. H1：明确工具名和核心用途。
2. 一句话说明：解决什么失败风险。
3. 工具输入区。
4. 结果卡片。
5. 可视化预览 / overlay。
6. 下载 / 复制操作。
7. “How to use this result”。
8. 官方规格或来源说明。
9. 常见错误解释。
10. FAQ。
11. 相关工具链接。
12. 免责声明。
13. 结果下方或 FAQ 中段广告位。

示例 H1：

- YouTube Banner Safe Area Tool
- A4 Size in Pixels Calculator
- Print Size Calculator
- TikTok Safe Zone Overlay
- LinkedIn Banner Size & Safe Zone
- X Header Size Crop Preview

---

## 11. SEO 页面计划

### 11.1 P0 首批 30 个关键词

| 关键词 | 页面 | 意图 | 工具模块 |
|---|---|---|---|
| aspect ratio calculator | Aspect Ratio Calculator | 计算比例 | 比例换算 |
| 16:9 aspect ratio calculator | Aspect Ratio Calculator | 等比缩放 | 比例换算 |
| 4:5 aspect ratio calculator | Aspect Ratio Calculator | 社媒比例 | 比例换算 |
| 9:16 aspect ratio calculator | Aspect Ratio Calculator | 短视频比例 | 比例换算 |
| cm to px | CM to Pixels | 单位换算 | DPI 计算 |
| px to cm | CM to Pixels | 单位换算 | DPI 计算 |
| mm to px | CM to Pixels | 单位换算 | DPI 计算 |
| dpi calculator | DPI Calculator | 打印换算 | DPI/PPI |
| ppi calculator | DPI Calculator | 清晰度 | DPI/PPI |
| print size calculator | Print Size Calculator | 判断打印尺寸 | 打印 |
| image print size calculator | Print Size Calculator | 图片能印多大 | 打印 |
| 300 dpi calculator | DPI Calculator | 印刷质量 | DPI/PPI |
| a4 size in pixels | A4 Size in Pixels | 纸张像素 | 纸张 |
| a4 300 dpi pixels | A4 Size in Pixels | 纸张像素 | 纸张 |
| letter size in pixels | Paper Size in Pixels | 纸张像素 | 纸张 |
| youtube banner safe area | YouTube Banner Safe Area | 安全区 | overlay |
| youtube banner size | YouTube Banner Safe Area | 尺寸查询 | overlay |
| youtube channel art safe zone | YouTube Banner Safe Area | 设备裁切 | overlay |
| youtube thumbnail safe zone | YouTube Thumbnail Safe Zone | UI 遮挡 | overlay |
| youtube thumbnail size | YouTube Thumbnail Safe Zone | 尺寸查询 | overlay |
| tiktok safe zone | Short Video Safe Zone | UI 遮挡 | overlay |
| tiktok video size | Short Video Safe Zone | 尺寸查询 | overlay |
| instagram reels safe zone | Short Video Safe Zone | UI 遮挡 | overlay |
| instagram story safe area | Short Video Safe Zone | UI 遮挡 | overlay |
| youtube shorts safe zone | Short Video Safe Zone | UI 遮挡 | overlay |
| linkedin banner size | LinkedIn Banner Size | 裁切预览 | overlay |
| linkedin banner safe zone | LinkedIn Banner Size | 安全区 | overlay |
| x header size | X Header Size | 裁切预览 | overlay |
| twitter header safe zone | X Header Size | 安全区 | overlay |
| resize image without cropping | Aspect Ratio / Fit Tool | 不裁切适配 | padding |

### 11.2 P1 关键词

- pinterest pin size
- pinterest 2:3 ratio
- google shopping image size
- product image size checker
- shopify image too large
- shopify image megapixel calculator
- universal social media image size
- social media image size calculator
- instagram image without cropping
- fit image to instagram without cropping
- xiaohongshu cover size
- 小红书封面尺寸
- 小红书图片比例
- 小红书图片不被裁剪

### 11.3 内容策略

每个页面不能只写尺寸答案。必须有：

- 用户常犯错误。
- 为什么尺寸正确仍会失败。
- 工具结果如何使用。
- 官方规格来源。
- 规格更新时间。
- 相关工具推荐。
- FAQ。

禁止：

- 堆砌关键词。
- 使用 meta keywords。
- 复制平台帮助文档。
- 声称 100% 保证平台显示效果。
- 用没有来源的“最新尺寸大全”。

---

## 12. UX 要求

### 12.1 输入区

原则：

- 首屏看到工具。
- 不要求注册。
- 不要求上传服务器。
- 默认给出常用 preset。
- 高级设置折叠。

字段：

- Platform / Use case。
- Current image width。
- Current image height。
- Target preset。
- DPI/PPI。
- Unit。
- Upload local image optional。
- Prefer crop or fit optional。

### 12.2 结果区

结果应分成三层：

1. **直接答案**：推荐尺寸、比例、风险等级。
2. **可视化**：安全区、裁切区、UI 遮挡区。
3. **操作**：复制、下载 overlay、下载模板、查看相关工具。

### 12.3 风险等级

统一风险文案：

- Safe：当前尺寸和关键区域基本适合。
- Warning：尺寸可用，但存在裁切或遮挡风险。
- Risky：尺寸、比例或清晰度明显不适合。
- Unsupported：格式、大小或尺寸不符合平台最低要求。
- Unknown：平台未提供官方精确数据，仅给参考。

### 12.4 移动端要求

- 输入区不可被广告遮挡。
- 上传按钮和计算按钮要大。
- overlay 预览允许横向缩放或全屏查看。
- 结果卡片置顶，不要让用户先看长文。
- 复制按钮要固定在结果卡片内。

---

## 13. 隐私与合规

### 13.1 图片处理隐私

必须明确写：

> Your image stays in your browser. We do not upload or store your file.

中文可写：

> 图片仅在你的浏览器本地读取，不会上传到服务器，也不会被保存。

### 13.2 免责声明

建议统一模板：

> This tool is for planning and educational use. Platform interfaces, device previews, and image requirements can change. Always verify final uploads in the target platform before publishing or printing.

中文：

> 本工具用于尺寸规划和预览参考。平台界面、设备显示和图片规格可能变化，最终发布或印刷前请在目标平台或打印流程中再次确认。

### 13.3 平台商标

- 不暗示与 YouTube、TikTok、LinkedIn、X、Pinterest、Google、Apple、Shopify、Instagram、小红书存在官方合作。
- 平台名称仅用于描述规格和用途。
- 页面底部可加：All trademarks belong to their respective owners.

---

## 14. AdSense 与 Affiliate 规划

### 14.1 AdSense 位置

允许：

- 结果区下方。
- FAQ 中段。
- 页面右侧边栏。
- 相关工具列表前后。
- 长说明内容之间。

禁止：

- 遮挡输入框。
- 遮挡计算按钮。
- 插入 overlay 预览中央。
- 误导为下载按钮。
- 造成 CLS 明显跳动。

### 14.2 Affiliate 方向

可承接：

- Adobe Express
- Canva
- Figma templates
- stock image / icon marketplaces
- print services
- photo books / posters / business card printing
- social media scheduling tools
- Shopify apps
- product photography tools
- creator tools
- marketplace seller tools

注意：

- affiliate 放在“下一步推荐”区域，不要干扰核心工具。
- 不要把 affiliate 写成官方要求。
- 明确标记 sponsored / affiliate disclosure。

---

## 15. 技术架构建议

### 15.1 前端

适合 Next.js / React 静态工具页。

组件拆分：

```text
/components/image-tools/
  AspectRatioCalculator.tsx
  DpiCalculator.tsx
  PrintSizeCalculator.tsx
  PaperSizeCalculator.tsx
  SafeZoneCanvas.tsx
  ImageUploadPreview.tsx
  OverlayDownloadButtons.tsx
  SpecResultCard.tsx
  RiskBadge.tsx
  RelatedTools.tsx
  SourceNote.tsx

/lib/image-tools/
  aspectRatio.ts
  dpi.ts
  paperSizes.ts
  safeZones.ts
  imageSpecs.ts
  fileInspection.ts
  overlayExport.ts
  formatters.ts

/data/
  imageSpecs.ts
  paperSizes.ts
  platformSources.ts
```

### 15.2 核心原则

- 尽量静态生成。
- 图片不上传服务器。
- 核心计算在前端完成。
- 数据库可版本化。
- 每个页面有独立 metadata、canonical、FAQ schema、breadcrumb。
- 不使用 meta keywords。
- 保持页面轻量，不引入重型图片编辑库作为首版依赖。

### 15.3 导出 overlay

MVP 实现方式：

- SVG overlay：直接构造 `<svg>` 字符串下载。
- PNG overlay：用 Canvas 绘制后 `toBlob()` 下载。
- 尺寸必须等于推荐画布尺寸。
- 透明背景。
- label 可选显示。

---

## 16. 分析事件

建议采集事件：

```text
tool_loaded
tool_calculated
image_uploaded_local
overlay_downloaded_png
overlay_downloaded_svg
copy_result_clicked
preset_selected
risk_warning_shown
related_tool_clicked
affiliate_clicked
ad_result_viewed
```

关键属性：

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
```

隐私注意：

- 不记录图片内容。
- 不记录文件名。
- 不记录本地路径。
- 只记录尺寸、类型、文件大小等级等非敏感数据。

---

## 17. 测试用例

### 17.1 计算测试

Aspect ratio：

- 1920×1080 → 16:9
- 1080×1920 → 9:16
- 1200×627 → 1.91:1
- 1000×1500 → 2:3
- 1080×1350 → 4:5

DPI：

- A4 210×297mm at 300DPI → 约 2480×3508
- 10cm at 300DPI → 约 1181px
- 3000px at 300DPI → 10in → 25.4cm

Megapixels：

- 5000×5000 → 25MP
- 4000×4000 → 16MP
- 4900×6930 → 约 33.96MP

YouTube banner：

- 2560×1440 full canvas
- 1546×423 safe area
- safe area 居中

X header：

- 1500×500 full canvas
- top 60px warning
- bottom 60px warning

### 17.2 UI 测试

- 移动端首屏可见计算器。
- 上传图片不触发网络请求。
- 下载 SVG 尺寸正确。
- 下载 PNG 背景透明。
- 复制按钮可用。
- FAQ schema 不重复。
- 广告不遮挡核心交互。
- 无 meta keywords。
- canonical 正确。
- sitemap 包含新页面。

### 17.3 内容测试

- 每页有明确最后检查日期。
- 平台规格有来源。
- 官方数据与社区观察分开标记。
- 对不确定 safe zone 不用绝对语气。
- 不声称与平台官方合作。
- 不承诺 100% 显示一致。

---

## 18. 90 天止损与扩展标准

### 18.1 止损条件

若上线 90 天后出现以下情况，应停止扩展，只保留已上线页面维护：

- P0 页面 GSC 总 impressions 低于 1,000。
- 核心工具按钮点击率低于 5%。
- 用户几乎只看答案不操作工具。
- 规格维护成本过高，每周超过 3 小时。
- 广告严重影响 UX 或通过率。
- 多数页面无法索引或被判定为低价值内容。

### 18.2 扩展条件

满足以下条件则扩展 P1：

- P0 页面至少 70% 被索引。
- 至少 3 个页面持续获得搜索曝光。
- 工具交互率高于 8%。
- overlay 下载事件存在真实使用。
- Print / DPI 相关页面带来稳定长尾曝光。
- YouTube / TikTok / LinkedIn 安全区页面有停留和点击。

### 18.3 优先扩展顺序

1. Product Image Size Checker  
2. Google Shopping Image Checker  
3. Shopify Image Megapixel Calculator  
4. Pinterest Pin Size Checker  
5. Universal Social Image Size Recommender  
6. Instagram Image Without Cropping  
7. 小红书封面尺寸  
8. Google Play Asset Checker  
9. App Store Screenshot Matrix  

---

## 19. 开发阶段计划

### Phase 0：现有站审计

目标：

- 查看 `print.ymirtool.com` 当前源码结构。
- 确认是否已有 DPI、paper size、bleed、safe margin 页面。
- 决定新路径是否用 `/image-size/`。
- 检查 sitemap、robots、canonical、adsense、footer。
- 确认构建方式与部署保护策略。

输出：

- 页面结构调整方案。
- 组件复用清单。
- 不重复造轮子的功能列表。

### Phase 1：核心计算库

开发：

- `aspectRatio.ts`
- `dpi.ts`
- `paperSizes.ts`
- `safeZones.ts`
- `fileInspection.ts`
- `overlayExport.ts`

验收：

- 单元测试通过。
- 计算结果与手工公式一致。
- 常见输入边界处理正常。

### Phase 2：P0 工具页

开发 10 个页面：

1. Aspect Ratio Calculator  
2. Print Size Calculator  
3. DPI Calculator  
4. CM to Pixels Calculator  
5. A4 Size in Pixels  
6. YouTube Banner Safe Area  
7. YouTube Thumbnail Safe Zone  
8. Short Video Safe Zone  
9. LinkedIn Banner Size  
10. X Header Size  

验收：

- 每页有工具。
- 每页有 FAQ。
- 每页有相关工具内链。
- 每页有来源说明。
- 每页有 canonical。
- sitemap 正确。

### Phase 3：AdSense 与内容质量

开发：

- 非侵入广告位。
- affiliate disclosure。
- footer 法务入口。
- Privacy / Disclaimer 更新。
- FAQ schema。
- Breadcrumb schema。

验收：

- 广告不遮挡工具。
- 无低质堆砌内容。
- 移动端体验正常。
- PageSpeed 不明显恶化。

### Phase 4：数据验证

上线后：

- 提交 sitemap。
- GSC 检查索引。
- 观察 query。
- 观察工具交互事件。
- 观察 overlay 下载事件。
- 每两周修正内容和内链。

---

## 20. 风险分析

### 20.1 竞争风险

强竞争对手：

- Canva
- Adobe Express
- Buffer
- Hootsuite
- Sprout Social
- Later
- Figma community templates
- Platform official help docs
- AI answer snippets

应对：

- 不做泛尺寸百科。
- 做计算器、overlay、下载、裁切预览。
- 把 print / DPI / safe zone 结合成垂直矩阵。
- 长尾切入，不抢纯大词。

### 20.2 维护风险

平台规格会变。

应对：

- 数据库集中管理。
- 每条规格有 `lastCheckedAt`。
- 来源分 official / secondary / observed。
- 页面显示“Last checked”。
- 每季度做规格巡检。
- 对不确定数据使用保守文案。

### 20.3 准确性风险

设备 UI 与裁切区域可能因 app 版本、设备、地区变化。

应对：

- 对 safe zone 使用“参考安全区”而不是“保证可见区”。
- 官方有精确数据时用官方。
- 没有官方精确数据时标记为 observed / estimated。
- 不承诺 100% 还原平台显示。

### 20.4 AdSense 低价值风险

如果页面只是尺寸表，可能被视为薄内容。

应对：

- 每页必须有工具交互。
- 每页必须有独特解释。
- 每页必须有 FAQ。
- 每页必须有可视化或下载结果。
- 避免复制官方规格文本。

---

## 21. 最终推荐 MVP 文案方向

首页 / 聚合页标题：

> Image Size, DPI & Safe Zone Tools

副标题：

> Check image dimensions, print size, aspect ratio, and platform safe zones before uploading or printing.

中文参考：

> 上传或打印前，检查图片尺寸、DPI、比例和平台安全区。

工具入口卡片：

- Print Size Calculator：Find how large your image can print at 300 DPI.
- A4 Size in Pixels：Get A4 pixel dimensions for 72, 96, 150, 300, and 600 DPI.
- Aspect Ratio Calculator：Resize or crop images without guessing.
- YouTube Banner Safe Area：Preview mobile, desktop, tablet, and TV crop areas.
- TikTok / Reels / Shorts Safe Zone：Keep text and logos away from UI overlays.
- LinkedIn Banner Size：Check cover image size and crop risk.
- X Header Size：Preview the 1500×500 header crop risk.

---

## 22. 资料来源

本需求文档综合了：

1. 用户上传的《免费工具站方向整合底稿（完整版，只保留可做方向）》中第四项目定义。  
2. Adobe Express YouTube Image Sizes 指南：`https://www.adobe.com/express/discover/sizes/youtube`  
3. YouTube Help：Add custom thumbnails：`https://support.google.com/youtube/answer/72431?hl=en`  
4. TikTok Ads Manager：Auction In-Feed Ads：`https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads`  
5. LinkedIn Help：Image specifications for LinkedIn Pages and Career Pages：`https://www.linkedin.com/help/linkedin/answer/a563309/image-specifications-for-your-linkedin-pages-and-career-pages`  
6. X Help：Profile photos and headers：`https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo`  
7. Pinterest Business Help：Review ad specs：`https://help.pinterest.com/en/business/article/pinterest-product-specs`  
8. Google Merchant Center Help：Image link attribute：`https://support.google.com/merchants/answer/6324350?hl=en`  
9. Shopify Help Center：Uploading images：`https://help.shopify.com/en/manual/online-store/images/theme-images`  
10. Google Play Console Help：Add preview assets：`https://support.google.com/googleplay/android-developer/answer/9866151?hl=en`  
11. Apple Developer：App Store screenshot specifications：`https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications`

---

## 23. 给代码 AI 的执行提示词

可以直接使用以下提示词生成开发计划或实施：

```text
你现在根据《第四项目需求文档：图像尺寸、比例、DPI 与安全区工具矩阵》为 print.ymirtool.com 生成开发计划并实施。

要求：
1. 不单独新开站，必须并入 print.ymirtool.com。
2. 只做 MVP，不做图片编辑器、不做 AI 出图、不做账号、不做云端保存。
3. 图片上传只允许浏览器本地预览，不上传服务器。
4. 第一版必须完成 10 个 P0 页面：
   - Aspect Ratio Calculator
   - Print Size Calculator
   - DPI / PPI Calculator
   - CM to Pixels Calculator
   - A4 Size in Pixels
   - YouTube Banner Safe Area Tool
   - YouTube Thumbnail Safe Zone
   - Short Video Safe Zone Overlay
   - LinkedIn Banner Size & Safe Zone
   - X Header Size Crop Preview
5. 每个页面必须有实际工具、结果卡片、FAQ、相关工具内链、来源说明、canonical、sitemap。
6. 不使用 meta keywords。
7. AdSense 不得遮挡输入区、按钮、预览区和下载按钮。
8. 所有平台规格集中在数据文件中管理，每条规格带 officialSourceUrl、sourceConfidence、lastCheckedAt。
9. 先审计现有源码结构，再批量实现同一阶段改动，避免碎片化提交。
10. 完成后给出构建检查、页面清单、未验证项和后续 P1 建议。
```

---

## 24. 最终判断

第四项目有做的价值，但只在以下条件下成立：

1. 并入 `print.ymirtool.com`。
2. 以 DPI、打印尺寸、比例换算、安全区预览为核心。
3. 每页都有轻工具，不做纯尺寸表。
4. 用官方规格做基线，用社区真实痛点决定功能。
5. 第一版控制范围，只做 10 个 P0 页面。
6. 上线后用 GSC 和交互事件决定是否扩展 P1。

最优产品形态不是“图片尺寸大全”，而是：

> **上传或打印前的图片尺寸风险检查器。**
