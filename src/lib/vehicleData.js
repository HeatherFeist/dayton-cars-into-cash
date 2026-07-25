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
// appended at build time below so we never forget it. Coverage now reaches
// back to the late 1970s (see QuoteForm.jsx's OLDEST_YEAR), so each make also
// lists its common classic-era ("malaise era" through '90s) models.
const MODELS = {
  Chevrolet: ['Silverado', 'Silverado 2500', 'Malibu', 'Impala', 'Cruze', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Blazer', 'Trailblazer', 'Trax', 'Cobalt', 'Camaro', 'Colorado', 'Sonic', 'Spark', 'Bolt', 'Express', 'HHR', 'Aveo', 'C10', 'C1500', 'K10', 'K1500', 'Caprice', 'Caprice Classic', 'Nova', 'Chevette', 'Monte Carlo', 'Citation', 'Celebrity', 'Corsica', 'Beretta', 'Cavalier', 'Corvair', 'Vega', 'El Camino', 'Chevy Van', 'Astro', 'S-10', 'Corvette'],
  Ford: ['F-150', 'F-250', 'F-350', 'Escape', 'Explorer', 'Focus', 'Fusion', 'Taurus', 'Edge', 'Ranger', 'Expedition', 'Mustang', 'Bronco', 'Bronco Sport', 'Maverick', 'EcoSport', 'Flex', 'Transit', 'Fiesta', 'Five Hundred', 'Freestyle', 'F-100', 'Pinto', 'Granada', 'LTD', 'LTD Crown Victoria', 'Crown Victoria', 'Fairmont', 'Mustang II', 'Thunderbird', 'Escort', 'Tempo', 'Probe', 'Contour', 'Aerostar', 'Windstar', 'Country Squire'],
  Toyota: ['Camry', 'Corolla', 'Corolla Cross', 'RAV4', 'Tacoma', 'Tundra', 'Highlander', '4Runner', 'Sienna', 'Prius', 'Avalon', 'Sequoia', 'Venza', 'C-HR', 'Yaris', 'Matrix', 'Celica', 'Corona', 'Cressida', 'Tercel', 'Pickup', 'Land Cruiser', 'Previa', 'MR2', 'Paseo'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'Ridgeline', 'HR-V', 'Passport', 'Element', 'Insight', 'CR-Z', 'Crosstour', 'Prelude', 'CVCC'],
  Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City', 'D150', 'D250', 'Ramcharger'],
  Dodge: ['Charger', 'Grand Caravan', 'Durango', 'Journey', 'Dart', 'Avenger', 'Challenger', 'Caliber', 'Nitro', 'Magnum', 'Aspen', 'Diplomat', 'Omni', 'Aries', '600', 'Shadow', 'Spirit', 'Dynasty', 'Daytona', 'Colt', 'Ram Van', 'Coronet', 'Monaco', 'Mirada'],
  Jeep: ['Grand Cherokee', 'Cherokee', 'Wrangler', 'Gladiator', 'Compass', 'Renegade', 'Grand Wagoneer', 'Wagoneer', 'Liberty', 'Patriot', 'Commander', 'CJ-5', 'CJ-7', 'Comanche'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Rogue Sport', 'Kicks', 'Maxima', 'Frontier', 'Titan', 'Murano', 'Pathfinder', 'Armada', 'Versa', 'Juke', 'Leaf', 'Xterra', 'Cube', '200SX', '240SX', '300ZX', 'Pulsar', 'Stanza'],
  Datsun: ['510', '200SX', '210', '280Z', '280ZX', 'B-210', 'Pickup', 'F-10'],
  GMC: ['Sierra', 'Sierra 2500', 'Yukon', 'Yukon XL', 'Acadia', 'Terrain', 'Canyon', 'Savana', 'Envoy', 'C1500', 'K1500', 'Jimmy', 'Caballero', 'Safari'],
  Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Santa Cruz', 'Tucson', 'Palisade', 'Accent', 'Kona', 'Venue', 'Veloster', 'Ioniq', 'Azera', 'Genesis Coupe', 'Excel'],
  Kia: ['Optima', 'K5', 'Forte', 'Sorento', 'Sportage', 'Telluride', 'Seltos', 'Soul', 'Rio', 'Carnival', 'Sedona', 'Stinger', 'Niro', 'Cadenza', 'Sephia', 'Spectra'],
  Chrysler: ['Pacifica', '300', 'Town & Country', '200', 'Sebring', 'Voyager', 'LeBaron', 'New Yorker', 'Cordoba', 'Fifth Avenue', 'Concorde', 'Cirrus', 'PT Cruiser'],
  Buick: ['Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse', 'Lucerne', 'Regal', 'Verano', 'Century', 'Skylark', 'LeSabre', 'Electra', 'Riviera', 'Skyhawk', 'Roadmaster', 'Park Avenue'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Legacy', 'Impreza', 'WRX', 'BRZ', 'GL', 'DL', 'Brat', 'Loyale'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30', 'CX-50', 'CX-90', 'MX-5 Miata', 'Tribute', '626', 'GLC', 'RX-7', 'B-Series'],
  Volkswagen: ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas', 'Taos', 'Beetle', 'Arteon', 'ID.4', 'Rabbit', 'Dasher', 'Scirocco', 'Fox', 'Quantum'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', '4 Series', '2 Series', '2002', 'E30', 'E28'],
  Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'A-Class', '190E', '240D', '300D', '280SE'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'A5', 'Q8', '4000', '5000', 'Fox'],
  Cadillac: ['Escalade', 'XT4', 'XT5', 'XT6', 'CTS', 'SRX', 'ATS', 'XTS', 'DeVille', 'Fleetwood', 'Seville', 'Eldorado', 'Coupe DeVille'],
  Lincoln: ['Navigator', 'Aviator', 'Corsair', 'Nautilus', 'MKZ', 'MKX', 'MKC', 'Continental', 'Town Car', 'Mark VI', 'Mark VII', 'Mark VIII', 'Versailles'],
  Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'V60', '240', '740', '760', '940'],
  Acura: ['TLX', 'MDX', 'RDX', 'ILX', 'TL', 'TSX', 'RLX', 'Integra', 'Legend', 'Vigor'],
  Lexus: ['RX', 'NX', 'ES', 'GX', 'IS', 'UX', 'LX', 'LS', 'SC'],
  Infiniti: ['Q50', 'QX50', 'QX60', 'QX80', 'G35', 'G37', 'FX35', 'M30', 'Q45'],
  Mitsubishi: ['Outlander', 'Outlander Sport', 'Eclipse Cross', 'Mirage', 'Galant', 'Lancer', 'Eclipse', 'Cordia', 'Tredia', 'Starion', 'Montero'],
  Mini: ['Cooper', 'Countryman', 'Clubman'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Discovery', 'Defender', 'LR4'],
  Jaguar: ['F-Pace', 'XF', 'XE', 'E-Pace', 'XJ6', 'XJS'],
  Porsche: ['Cayenne', 'Macan', '911', 'Panamera', '928', '944', '924'],
  Fiat: ['500', '500X', '500L', '128', 'Spider'],
  // Older / discontinued makes people still bring to junk lots
  AMC: ['Gremlin', 'Pacer', 'Concord', 'Eagle', 'Spirit', 'Hornet', 'Matador', 'Javelin'],
  Pontiac: ['Grand Prix', 'G6', 'G8', 'Grand Am', 'Bonneville', 'Vibe', 'Torrent', 'Aztek', 'Firebird', 'Trans Am', 'LeMans', 'Catalina', 'Phoenix', 'Sunbird', 'Fiero', 'Ventura', 'Parisienne'],
  Saturn: ['Ion', 'Vue', 'Aura', 'Outlook', 'Sky', 'L Series', 'S Series'],
  Mercury: ['Grand Marquis', 'Sable', 'Mountaineer', 'Milan', 'Mariner', 'Cougar', 'Marquis', 'Zephyr', 'Capri', 'Bobcat', 'Topaz', 'Monarch', 'Lynx'],
  Oldsmobile: ['Alero', 'Intrigue', 'Aurora', 'Silhouette', 'Bravada', 'Cutlass', 'Cutlass Supreme', 'Cutlass Ciera', 'Delta 88', 'Ninety-Eight', 'Omega', 'Firenza', 'Toronado', 'Custom Cruiser'],
  Scion: ['tC', 'xB', 'xD', 'iA', 'FR-S'],
  Suzuki: ['Grand Vitara', 'SX4', 'Forenza', 'Aerio', 'Samurai', 'Sidekick', 'Swift'],
  Hummer: ['H2', 'H3'],
  Saab: ['9-3', '9-5', '900', '9000'],
  Plymouth: ['Voyager', 'Neon', 'Breeze', 'Volare', 'Horizon', 'Reliant', 'Duster', 'Valiant', 'Fury', 'Gran Fury', 'Sundance', 'Acclaim', 'Champ', 'Arrow'],
  Studebaker: ['Lark', 'Avanti', 'Commander'],
  Isuzu: ['Trooper', 'Rodeo', 'Pickup', 'Amigo', 'Impulse'],
  Renault: ['Alliance', 'Encore', 'LeCar', 'Fuego'],
  Peugeot: ['505', '604', '405'],
  'International Harvester': ['Scout', 'Scout II', 'Travelall'],
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
