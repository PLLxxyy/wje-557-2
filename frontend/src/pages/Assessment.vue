<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EChartPanel from '../components/common/EChartPanel.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { assessmentRadarOption } from '../charts/assessmentRadar'
import { answerOptions, assessmentQuestions } from '../constants/assessment-questions'
import { AssessmentType } from '../constants/enums'
import { useAssessment } from '../hooks/useAssessment'

const { assessments, latest, loadAssessments, submitAssessment } = useAssessment()
const selectedType = ref<AssessmentType.PHQ9 | AssessmentType.GAD7>(AssessmentType.PHQ9)
const step = ref(0)
const answers = ref<number[]>([])

const questions = computed(() => assessmentQuestions[selectedType.value])
const currentQuestion = computed(() => questions.value[step.value])

onMounted(loadAssessments)

function answer(score: number) {
  answers.value[step.value] = score
  if (step.value < questions.value.length - 1) {
    step.value += 1
  }
}

async function submit() {
  const completedAnswers = questions.value.map((_, index) => answers.value[index] ?? 0)
  await submitAssessment(selectedType.value, completedAnswers)
  answers.value = []
  step.value = 0
  window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '测评报告已生成。' }))
}
</script>

<template>
  <section class="page-heading">
    <p class="eyebrow">Assessment</p>
    <h1>心理测评</h1>
    <p>PHQ-9 与 GAD-7 本地测评，结果只保存在当前浏览器。</p>
  </section>

  <section class="workspace-grid">
    <div class="surface assessment-card">
      <div class="filter-row">
        <button type="button" :class="{ active: selectedType === AssessmentType.PHQ9 }" @click="selectedType = AssessmentType.PHQ9; step = 0; answers = []">PHQ-9</button>
        <button type="button" :class="{ active: selectedType === AssessmentType.GAD7 }" @click="selectedType = AssessmentType.GAD7; step = 0; answers = []">GAD-7</button>
      </div>
      <p class="eyebrow">{{ step + 1 }} / {{ questions.length }}</p>
      <h2>{{ currentQuestion.text }}</h2>
      <div class="answer-list">
        <button v-for="option in answerOptions" :key="option.score" type="button" :class="{ active: answers[step] === option.score }" @click="answer(option.score)">
          {{ option.label }}
        </button>
      </div>
      <div class="action-row">
        <button type="button" :disabled="step === 0" @click="step -= 1">上一题</button>
        <button class="primary-action" type="button" @click="submit">生成报告</button>
      </div>
    </div>

    <aside class="surface">
      <EChartPanel title="最近一次维度雷达" :option="assessmentRadarOption(latest)" />
      <div v-if="latest" class="report-box">
        <strong>{{ latest.type }} · {{ latest.totalScore }} 分 · {{ latest.severity }}</strong>
        <ul>
          <li v-for="item in latest.recommendations" :key="item">{{ item }}</li>
        </ul>
      </div>
      <EmptyState v-else title="暂无测评报告" description="完成一次答题后，这里会显示图表和建议。" />
    </aside>
  </section>

  <section class="surface">
    <div class="section-title">
      <h2>历史报告</h2>
      <span>{{ assessments.length }} 次</span>
    </div>
    <article v-for="item in assessments" :key="item.id" class="history-row">
      <strong>{{ item.type }} · {{ item.severity }}</strong>
      <span>{{ item.totalScore }} 分</span>
      <time>{{ item.completedAt.slice(0, 10) }}</time>
    </article>
  </section>
</template>

