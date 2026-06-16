# MindWell

MindWell 是一款移动端优先的心理健康与情绪管理平台，情绪日记、冥想练习、心理测评、目标管理与数据洞察全部运行在浏览器本地，数据存储于 IndexedDB，不上传服务器。

## 主要功能

- 今日心情：5 级心情 Emoji、情绪标签、触发因素、活动、睡眠与日记记录，同一日期覆盖更新。
- 情绪日记：年度热力图、趋势图、情绪分布图、按心情与标签筛选。
- 冥想练习：呼吸、身体扫描、正念、慈心冥想计时，支持提前结束和历史统计。
- 心理测评：PHQ-9、GAD-7 逐题作答，自动计算分数、严重程度和建议。
- 数据洞察：睡眠与情绪散点、心情趋势、情绪分布、测评雷达图。
- 设置：暖色、冷静蓝、暗色主题切换；数据导入、导出、清除；操作日志查看。

## 快速启动

```bash
cd frontend
npm install
npm run dev
```

访问地址：http://localhost:38207

## 本地验证

```bash
cd frontend
npm run build
npm run verify:db
```

`verify:db` 使用 fake-indexeddb 验证 MoodEntry 从 Repository 保存、按日期读取、列表读取的完整链路。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 图表 | ECharts |
| 本地存储 | IndexedDB + idb |
| 验证脚本 | tsx + fake-indexeddb |

## 目录结构

```text
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── scripts/
│   └── verify-db.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/
    │   └── index.ts
    ├── stores/
    │   ├── moodStore.ts
    │   ├── meditationStore.ts
    │   ├── assessmentStore.ts
    │   ├── goalStore.ts
    │   └── settingsStore.ts
    ├── types/
    │   ├── mood.d.ts
    │   ├── meditation.d.ts
    │   ├── assessment.d.ts
    │   └── goal.d.ts
    ├── constants/
    │   ├── enums.ts
    │   ├── emotions.ts
    │   └── assessment-questions.ts
    ├── components/common/
    │   ├── MoodEmoji.vue
    │   ├── ProgressRing.vue
    │   ├── WeeklyCalendar.vue
    │   ├── EmptyState.vue
    │   ├── ThemeToggle.vue
    │   └── EChartPanel.vue
    ├── hooks/
    │   ├── useMood.ts
    │   ├── useMeditation.ts
    │   ├── useAssessment.ts
    │   ├── useGoal.ts
    │   └── useTheme.ts
    ├── pages/
    │   ├── Home.vue
    │   ├── Journal.vue
    │   ├── Meditation.vue
    │   ├── Assessment.vue
    │   ├── Insights.vue
    │   └── Settings.vue
    ├── charts/
    │   ├── moodTrend.ts
    │   ├── moodHeatmap.ts
    │   ├── emotionDistribution.ts
    │   ├── correlation.ts
    │   ├── meditationStats.ts
    │   └── assessmentRadar.ts
    ├── db/
    │   ├── database.ts
    │   ├── moodRepository.ts
    │   ├── meditationRepository.ts
    │   ├── assessmentRepository.ts
    │   ├── goalRepository.ts
    │   └── logRepository.ts
    └── utils/
        ├── id.ts
        ├── date.ts
        ├── export.ts
        └── import.ts
```

## 共享枚举引用关系清单

- `MoodLevel`：`src/constants/enums.ts` → `src/types/mood.d.ts` → `src/stores/moodStore.ts` → `src/components/common/MoodEmoji.vue` → `src/pages/Home.vue`、`src/pages/Journal.vue`、`src/pages/Insights.vue`
- `EmotionTag`：`src/constants/enums.ts` → `src/types/mood.d.ts` → `src/stores/moodStore.ts` → `src/pages/Home.vue`、`src/pages/Journal.vue`、`src/pages/Insights.vue`
- `MeditationType`：`src/constants/enums.ts` → `src/types/meditation.d.ts` → `src/stores/meditationStore.ts` → `src/pages/Meditation.vue`
- `AssessmentType`：`src/constants/enums.ts` → `src/types/assessment.d.ts` → `src/stores/assessmentStore.ts` → `src/constants/assessment-questions.ts` → `src/pages/Assessment.vue`
- `SeverityLevel`：`src/constants/enums.ts` → `src/types/assessment.d.ts` → `src/stores/assessmentStore.ts` → `src/pages/Assessment.vue`、`src/pages/Insights.vue`
- `GoalCategory`：`src/constants/enums.ts` → `src/types/goal.d.ts` → `src/stores/goalStore.ts` → `src/pages/Home.vue`
- `ThemeType`：`src/constants/enums.ts` → `src/stores/settingsStore.ts` → `src/components/common/ThemeToggle.vue` → 全局 Layout

## 核心实体数据流

以 MoodEntry 为例：

```text
IndexedDB → db/moodRepository.ts → stores/moodStore.ts → hooks/useMood.ts → pages/Home.vue、pages/Journal.vue
                                      ↓
                              types/mood.d.ts ← constants/enums.ts
```

所有写操作通过 repository 调用 `logOperation()` 写入 `operationLogs` 表，设置页可查看最近操作日志。数据库层使用 `safeDb()` 统一捕获 IndexedDB 异常并触发全局 toast。

## 环境变量

当前项目无必需环境变量。所有数据保存在当前浏览器的 IndexedDB 中。

## License

MIT
