import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useCallback } from 'react'
import { AnalyzingScreen } from './components/AnalyzingScreen'
import { Hero } from './components/Hero'
import { Background } from './components/layout/Background'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ResultScreen } from './components/ResultScreen'
import { SurveyWizard } from './components/survey/SurveyWizard'
import { useSubmission } from './hooks/useSubmission'
import { useSurvey } from './hooks/useSurvey'

export default function App() {
  const survey = useSurvey()
  const submission = useSubmission(survey.submissionId)
  const { reset: resetSurvey } = survey
  const { reset: resetSubmission } = submission

  const restart = useCallback(() => {
    resetSubmission()
    resetSurvey()
  }, [resetSubmission, resetSurvey])

  const view =
    submission.phase === 'idle'
      ? 'survey'
      : submission.phase === 'done' && submission.answers
        ? 'result'
        : 'progress'

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <a
        href="#diagnostico"
        className="sr-only z-50 rounded-lg bg-neon px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al diagnóstico
      </a>
      <Header />

      <main className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,580px)] lg:gap-14 lg:px-8 lg:pt-20 lg:pb-24">
        <Hero />

        <section
          id="diagnostico"
          aria-label="Diagnóstico gratuito"
          className="glass relative scroll-mt-24 rounded-3xl p-5 shadow-ambient sm:p-8"
        >
          <span
            className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent"
            aria-hidden
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {view === 'survey' && (
                <SurveyWizard survey={survey} onSubmit={submission.submit} />
              )}
              {view === 'progress' && (
                <AnalyzingScreen
                  phase={submission.phase}
                  error={submission.error}
                  onRetry={submission.retry}
                  onEdit={resetSubmission}
                />
              )}
              {view === 'result' && submission.answers && (
                <ResultScreen
                  answers={submission.answers}
                  onRestart={restart}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </MotionConfig>
  )
}
