// Peddle-style condition questions, in the order the wizard asks them.
//
// Kept short (4 questions) so the quote is fast: the ones that actually move
// the estimate — does it start/drive, is the drivetrain in it, body condition
// — plus the title question. Minor factors (wheels, catalytic converter,
// interior) are confirmed by phone instead; estimateOffer.js treats any
// missing answer as no-effect, so dropping them does not skew the quote.
//
// The `value` on every option is the string estimateOffer.js matches on —
// keep them in sync.
//
// Title copy: do not say a title is required unless the yard wrote that in
// site.config.js titleNote. The sample note is that they can often still help.

export const CONDITION_QUESTIONS = [
  {
    field: 'starts',
    question: 'Does your vehicle start?',
    help: 'Even if it needs a jump, choose the option that fits best.',
    options: [
      { value: 'starts_drives', label: 'It starts and drives' },
      { value: 'starts_no_drive', label: "It starts but doesn't drive" },
      { value: 'no_start', label: "It doesn't start" },
    ],
  },
  {
    field: 'whole',
    question: 'Is the engine & transmission still in the vehicle?',
    help: 'Tell us if any major parts have been removed.',
    options: [
      { value: 'whole', label: 'Yes, the vehicle is whole' },
      { value: 'missing_minor', label: 'Mostly — a few minor parts are missing' },
      { value: 'missing_engine', label: 'No, the engine or transmission is out' },
    ],
  },
  {
    field: 'bodyDamage',
    question: 'How is the body & exterior?',
    help: 'Dents, rust, and collision damage all count.',
    options: [
      { value: 'none', label: 'No real damage' },
      { value: 'minor', label: 'Minor dents, dings, or rust' },
      { value: 'moderate', label: 'Moderate damage' },
      { value: 'severe', label: 'Severe / wrecked / totaled' },
    ],
  },
  {
    field: 'title',
    question: 'Do you have the title, in your name?',
    help: 'Tell us how the title stands. We will walk you through the next step.',
    options: [
      { value: 'clean_in_name', label: 'Yes, a clean title in my name' },
      { value: 'in_name_lien', label: "In my name, but there's a lien" },
      { value: 'not_in_name', label: 'A title, but not in my name' },
      { value: 'no_title', label: "I don't have the title" },
    ],
  },
]

export const NO_TITLE_VALUE = 'no_title'

export function questionsForYard(titleNote) {
  const note = String(titleNote || '').trim()
  return CONDITION_QUESTIONS.map((question) => {
    if (question.field !== 'title' || !note) return question
    return { ...question, help: note }
  })
}

export function optionLabel(field, value) {
  const question = CONDITION_QUESTIONS.find((row) => row.field === field)
  const option = question?.options.find((row) => row.value === value)
  return option?.label || value || ''
}

export function conditionSummary(form) {
  const parts = ['starts', 'whole', 'bodyDamage', 'title']
    .map((field) => optionLabel(field, form[field]))
    .filter(Boolean)
  return parts.join('; ')
}
