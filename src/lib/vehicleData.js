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
  Chevrolet: ['Silverado', 'Silverado 2500', 'Malibu', 'Impala', 'Cruze', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Blazer', 'Trailblazer', 'Trax', 'Cobalt', 'Camaro', 'Colorado', 'Sonic', 'Spark', 'Bolt', 'Express', 'HHR', 'Aveo'],
  Ford: ['F-150', 'F-250', 'F-350', 'Escape', 'Explorer', 'Focus', 'Fusion', 'Taurus', 'Edge', 'Ranger', 'Expedition', 'Mustang', 'Bronco', 'Bronco Sport', 'Maverick', 'EcoSport', 'Flex', 'Transit', 'Fiesta', 'Five Hundred', 'Freestyle'],
  Toyota: ['Camry', 'Corolla', 'Corolla Cross', 'RAV4', 'Tacoma', 'Tundra', 'Highlander', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Sequoia', 'Venza', 'C-HR', 'Yaris', 'Matrix'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'Ridgeline', 'HR-V', 'Passport', 'Element', 'Insight', 'CR-Z', 'Crosstour'],
  Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
  Dodge: ['Charger', 'Grand Caravan', 'Durango', 'Journey', 'Dart', 'Avenger', 'Challenger', 'Caliber', 'Nitro', 'Magnum'],
  Jeep: ['Grand Cherokee', 'Cherokee', 'Wrangler', 'Gladiator', 'Compass', 'Renegade', 'Grand Wagoneer', 'Wagoneer', 'Liberty', 'Patriot', 'Commander'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Rogue Sport', 'Kicks', 'Maxima', 'Frontier', 'Titan', 'Murano', 'Pathfinder', 'Armada', 'Versa', 'Juke', 'Leaf', 'Xterra', 'Cube'],
  GMC: ['Sierra', 'Sierra 2500', 'Yukon', 'Yukon XL', 'Acadia', 'Terrain', 'Canyon', 'Savana', 'Envoy'],
  Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Santa Cruz', 'Tucson', 'Palisade', 'Accent', 'Kona', 'Venue', 'Veloster', 'Ioniq', 'Azera', 'Genesis Coupe'],
  Kia: ['Optima', 'K5', 'Forte', 'Sorento', 'Sportage', 'Telluride', 'Seltos', 'Soul', 'Rio', 'Carnival', 'Sedona', 'Stinger', 'Niro', 'Cadenza'],
  Chrysler: ['Pacifica', '300', 'Town & Country', '200', 'Sebring', 'Voyager'],
  Buick: ['Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse', 'Lucerne', 'Regal', 'Verano'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Legacy', 'Impreza', 'WRX', 'BRZ'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30', 'CX-50', 'CX-90', 'MX-5 Miata', 'Tribute'],
  Volkswagen: ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas', 'Taos', 'Beetle', 'Arteon', 'ID.4'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', '4 Series', '2 Series'],
  Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'A-Class'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'A5', 'Q8'],
  Cadillac: ['Escalade', 'XT4', 'XT5', 'XT6', 'CTS', 'SRX', 'ATS', 'XTS', 'DeVille'],
  Lincoln: ['Navigator', 'Aviator', 'Corsair', 'Nautilus', 'MKZ', 'MKX', 'MKC', 'Continental', 'Town Car'],
  Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60'],
  Acura: ['TLX', 'MDX', 'RDX', 'ILX', 'TL', 'TSX', 'RLX'],
  Lexus: ['RX', 'NX', 'ES', 'GX', 'IS', 'UX', 'LX', 'LS'],
  Infiniti: ['Q50', 'QX50', 'QX60', 'QX80', 'G35', 'G37', 'FX35'],
  Mitsubishi: ['Outlander', 'Outlander Sport', 'Eclipse Cross', 'Mirage', 'Galant', 'Lancer', 'Eclipse'],
  Mini: ['Cooper', 'Countryman', 'Clubman'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Discovery', 'Defender', 'LR4'],
  Jaguar: ['F-Pace', 'XF', 'XE', 'E-Pace'],
  Porsche: ['Cayenne', 'Macan', '911', 'Panamera'],
  Fiat: ['500', '500X', '500L'],
  // Older / discontinued makes people still bring to junk lots
  Pontiac: ['Grand Prix', 'G6', 'G8', 'Grand Am', 'Bonneville', 'Vibe', 'Torrent', 'Aztek'],
  Saturn: ['Ion', 'Vue', 'Aura', 'Outlook', 'Sky', 'L Series'],
  Mercury: ['Grand Marquis', 'Sable', 'Mountaineer', 'Milan', 'Mariner'],
  Oldsmobile: ['Alero', 'Intrigue', 'Aurora', 'Silhouette', 'Bravada'],
  Scion: ['tC', 'xB', 'xD', 'iA', 'FR-S'],
  Suzuki: ['Grand Vitara', 'SX4', 'Forenza', 'Aerio'],
  Hummer: ['H2', 'H3'],
  Saab: ['9-3', '9-5'],
  Plymouth: ['Voyager', 'Neon', 'Breeze'],
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
