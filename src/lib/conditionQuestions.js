// Peddle-style condition questions, in the order the wizard asks them.
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
    field: 'wheels',
    question: 'Are all four wheels & tires intact?',
    help: 'We need to know if it can roll onto the tow truck.',
    options: [
      { value: 'all_intact', label: 'Yes, all four are on and hold air' },
      { value: 'some_missing', label: 'No, one or more is flat or missing' },
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
    field: 'catalytic',
    question: 'Is the catalytic converter still on the vehicle?',
    help: 'A missing converter affects the offer.',
    options: [
      { value: 'present', label: 'Yes, it’s still there' },
      { value: 'missing', label: 'No, it’s been removed or cut off' },
      { value: 'unknown', label: 'Not sure' },
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
    field: 'interior',
    question: 'How is the interior?',
    help: 'Seats, dash, and electronics.',
    options: [
      { value: 'intact', label: 'Intact and complete' },
      { value: 'damaged', label: 'Damaged or worn' },
      { value: 'missing', label: 'Seats or major parts missing' },
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
