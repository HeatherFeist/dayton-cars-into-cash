// Peddle-style condition questions, in the order the wizard asks them.
//
// Kept intentionally short (4 questions) so the quote is fast: the ones that
// actually move the estimate — does it start/drive, is the drivetrain in it,
// body condition — plus the title question (a legal gate on buying). Minor
// factors we used to ask about (wheels, catalytic converter, interior) are
// confirmed by phone instead; estimateOffer.js treats any missing answer as
// no-effect, so dropping them doesn't skew the quote.
//
// Each question drives ONE step of the multi-step form. The `value` on every
// option is the string estimateOffer.js matches on — keep them in sync. The
// wording mirrors Peddle's instant-offer flow but is our own copy.
//
// `field` is the key written onto the form state (and, ultimately, the
// Supabase lead row). Add a column to dayton_cars_leads for each new field
// (see supabase/leads_table.sql).

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
    help: 'A valid title is required for us to buy the vehicle.',
    options: [
      { value: 'clean_in_name', label: 'Yes, a clean title in my name' },
      { value: 'in_name_lien', label: 'In my name, but there’s a lien' },
      { value: 'not_in_name', label: 'A title, but not in my name' },
      { value: 'no_title', label: 'I don’t have the title' },
    ],
  },
]

// The one title answer that blocks a purchase outright. (A lien or a
// not-yet-transferred title we can still work with by phone; no title at all
// we can't.)
export const NO_TITLE_VALUE = 'no_title'
