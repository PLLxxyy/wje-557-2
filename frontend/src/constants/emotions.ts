import { EmotionTag, MoodLevel } from './enums'

export const emotionOptions = [
  { value: EmotionTag.HAPPY, icon: 'smile', color: '#f0a73a' },
  { value: EmotionTag.ANXIOUS, icon: 'pulse', color: '#7587c6' },
  { value: EmotionTag.CALM, icon: 'leaf', color: '#5aa897' },
  { value: EmotionTag.ANGRY, icon: 'flame', color: '#d96a5e' },
  { value: EmotionTag.SAD, icon: 'cloud', color: '#7d8fa8' },
  { value: EmotionTag.EXCITED, icon: 'spark', color: '#e7835d' },
  { value: EmotionTag.TIRED, icon: 'moon', color: '#897a9e' },
  { value: EmotionTag.GRATEFUL, icon: 'heart', color: '#c77b8b' },
]

export const moodOptions = [
  { level: MoodLevel.VERY_BAD, emoji: '😣', label: '很差', tone: '#bd5b55' },
  { level: MoodLevel.BAD, emoji: '🙁', label: '较差', tone: '#d48a5c' },
  { level: MoodLevel.NEUTRAL, emoji: '😐', label: '一般', tone: '#c2a65c' },
  { level: MoodLevel.GOOD, emoji: '🙂', label: '较好', tone: '#78a86f' },
  { level: MoodLevel.VERY_GOOD, emoji: '😊', label: '很好', tone: '#4c9c83' },
]

export const encouragements = [
  '慢一点也没关系，今天先照顾好自己。',
  '把感受写下来，就是一次温柔的整理。',
  '留意身体的信号，它比日程更诚实。',
  '今天的记录只属于你，不需要解释给任何人。',
  '情绪不是问题，它是在递送线索。',
]
