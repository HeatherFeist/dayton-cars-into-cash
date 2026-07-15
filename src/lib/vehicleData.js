// Make → model lists for the quote form's dependent dropdowns.
//
// This is intentionally a curated, common-vehicle list (not an exhaustive
// database). Junk cars are often old or oddball, so EVERY make's model list
// ends with "Other" and the make list ends with "Other" too — nobody gets
// stuck because their exact car isn't listed. The model values are kept as
// plain, human-readable names because estimateOffer.js matches on those
// strings (e.g. "Explorer", "F-150") to guess vehicle weight.

export const OTHER = 'Other'

// Ordered roughly by how often these show up in the Dayton/Ohio used + junk
// market. Each array is the make's common models, alphabetical-ish, "Other"
// appended at build time below so we never forget it.
const MODELS = {
  Chevrolet: ['Silverado', 'Malibu', 'Impala', 'Cruze', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Blazer', 'Trailblazer', 'Cobalt', 'Camaro', 'Colorado', 'Express'],
  Ford: ['F-150', 'F-250', 'F-350', 'Escape', 'Explorer', 'Focus', 'Fusion', 'Taurus', 'Edge', 'Ranger', 'Expedition', 'Mustang', 'Transit'],
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Tacoma', 'Tundra', 'Highlander', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Sequoia'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'Ridgeline', 'HR-V', 'Element'],
  Dodge: ['Ram', 'Ram 2500', 'Charger', 'Grand Caravan', 'Durango', 'Journey', 'Dart', 'Avenger', 'Challenger'],
  Jeep: ['Grand Cherokee', 'Cherokee', 'Wrangler', 'Liberty', 'Compass', 'Patriot', 'Renegade'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Maxima', 'Frontier', 'Titan', 'Murano', 'Pathfinder', 'Versa'],
  GMC: ['Sierra', 'Sierra 2500', 'Yukon', 'Acadia', 'Terrain', 'Canyon', 'Savana'],
  Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Accent', 'Kona'],
  Kia: ['Optima', 'Forte', 'Sorento', 'Sportage', 'Soul', 'Rio'],
  Chrysler: ['Town & Country', 'Pacifica', '200', '300', 'Sebring'],
  Buick: ['Enclave', 'LaCrosse', 'Lucerne', 'Regal', 'Encore'],
  Subaru: ['Outback', 'Forester', 'Legacy', 'Impreza', 'Crosstrek'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'Tribute'],
  Volkswagen: ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Beetle'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
  Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC'],
  Cadillac: ['Escalade', 'CTS', 'SRX', 'DeVille', 'XTS'],
  Lincoln: ['Navigator', 'MKZ', 'MKX', 'Town Car'],
  Pontiac: ['Grand Prix', 'G6', 'Grand Am', 'Bonneville', 'Vibe'],
  Saturn: ['Ion', 'Vue', 'Aura', 'Outlook'],
  Mercury: ['Grand Marquis', 'Sable', 'Mountaineer', 'Milan'],
  Volvo: ['S60', 'XC90', 'XC60', 'S40'],
  Acura: ['TL', 'MDX', 'RDX', 'TSX'],
  Lexus: ['RX', 'ES', 'GX', 'IS'],
  Infiniti: ['G35', 'G37', 'QX60', 'FX35'],
  Mitsubishi: ['Outlander', 'Galant', 'Lancer', 'Eclipse'],
}

// Make list: the curated makes above, then "Other" at the very end.
export const MAKES = [...Object.keys(MODELS), OTHER]

// Look up the models for a make, always with "Other" appended. Unknown make
// (or the "Other" make) returns just ["Other"] so the model field still works.
export function modelsForMake(make) {
  const list = MODELS[make]
  if (!list) return [OTHER]
  return [...list, OTHER]
}
