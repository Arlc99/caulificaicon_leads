import { TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export function FieldError({ id, message }: { id?: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-300"
        >
          <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
