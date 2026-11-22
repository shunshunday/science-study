# KSP1 Parts Master Inventory

Updated: 2026-11-22

## Per-part audit register
`KSP1_PARTS_MODEL_AUDIT.json` now contains 128 records corresponding to every existing project catalog entry. Each record tracks the current placeholder entry separately from the still-unverified KSP internal part ID, official part match, DLC provenance, model source, creator, asset license, redistribution permission and GLB-conversion permission. The register is a baseline for individual verification, not a completed stock/DLC inventory. No model is marked approved yet.

## Scope
Kerbal Space Program 1.12.x base game, plus Making History and Breaking Ground. The Japanese parts index separates DLC additions:
https://wikiwiki.jp/ksp/パーツ

## Base-game families to enumerate
1. Command and control: crew pods, lander cans, cockpits, external seats, probe cores.
2. Propulsion resources: LFO tanks, liquid-fuel-only fuselages, monopropellant tanks, xenon tanks, ore tanks, fuel ducts and valves.
3. Engines: liquid-fuel rocket engines, nuclear engines, monopropellant engines, jet engines, RAPIER, ion engines, solid rocket motors.
4. Staging and attachment: stack/radial decouplers, separators, docking ports, launch clamps, fuel-line connectors, stack and radial adapters.
5. Structural: beams, panels, girders, launch supports, struts, cubic/octagonal struts, structural tubes and adapters.
6. Aerodynamics: nose cones, engine nacelles, intakes, wings, control surfaces, fins, wing connectors, airbrakes, cargo/fairing pieces.
7. Landing and mobility: landing legs, landing gear, rover wheels, grip pads, ladders.
8. Parachutes and recovery: radial, stack and drogue parachutes; heat shields and inflatable heat shields.
9. Power and thermal: batteries, solar panels, RTGs, radiators and thermal control.
10. Communications: direct and relay antennas.
11. Science: experiment modules, science storage, laboratories, scanners and surface experiment equipment.
12. Utility and resource extraction: lights, service bays, cargo bays, drills, converters, resource scanners and stock utility parts.

## Making History
Enumerate every part in the wiki's Making History sections and preserve DLC provenance. Families include historical command modules, launch vehicles and tanks, engines, structural adapters, fairings and expansion-specific parts. Verify each item against the DLC list; do not infer ownership from appearance.

## Breaking Ground
Enumerate every part in the wiki's Breaking Ground sections and preserve DLC provenance:
- Robotics: hinges, pistons, rotors, motors, controllers and robotic attachment components.
- Deployed science: experiment modules, power units, communications, storage and deployment hardware.
- Surface/ground equipment and inventory items identified as parts.

## Legacy / removed
Keep obsolete, deprecated, or version-specific parts outside the current 1.12.x catalog. Record the last known version and reason for separation.

## Asset sourcing policy
A part name, stat table, thumbnail, or model converter is not permission to redistribute original game assets.

For every imported model and texture, record:
- source URL and creator;
- exact license applying to the model and textures, not only source code;
- permission for redistribution, modification, conversion to glTF/GLB, and GitHub Pages hosting;
- attribution and share-alike/non-commercial requirements;
- checksum, local asset path, matching KSP part identifier and variants.

Do not import stock .mu, .dds, .png or other game assets extracted from an installation unless redistribution permission is explicit. Mod assets do not automatically inherit a mod's code license. Example: Station Parts Expansion Redux reserves rights to its art assets:
https://github.com/post-kerbin-mining-corporation/StationPartsExpansionRedux

KSP Community's Mod Parts Lister is a discovery/indexing resource, not an asset license:
https://github.com/kspcommunity/Mod-Parts-Lister

## Current project state
- The inspected space-project/game.js revision contains 128 catalog entries.
- These are procedural generic Three.js placeholders, not official KSP meshes.
- No verified redistributable KSP stock/DLC model assets have been approved for import yet.
- The current catalog has not been deleted. Removing it before a complete replacement is ready would leave the editor empty or broken.
- This family list is an enumeration checklist, not a claim that every individual part has already been itemized.

## Implementation gates
1. Finish a row-per-part inventory with exact stock name, internal part ID, category, DLC flag, size, mass, resource capacity, cost, thrust/Isp and action behavior where applicable.
2. Verify each row against KSP 1.12.x part definitions and the wiki; retain source URLs.
3. Obtain redistributable models or commission original models for parts without approved assets.
4. Convert approved models to web-friendly glTF/GLB and document attribution/license.
5. Implement attachment nodes, orientation, stack/radial/surface attach rules, colliders, variants and functional modules.
6. Validate every part in the browser editor and flight simulation.
7. Switch the editor to the replacement catalog only after the replacement is complete; then archive/remove old definitions.

## References
- Japanese stock parts index: https://wikiwiki.jp/ksp/パーツ
- KSP Community mod parts index: https://github.com/kspcommunity/Mod-Parts-Lister
- KSP Community organization: https://github.com/kspcommunity
- Example mod reserving rights to art assets: https://github.com/post-kerbin-mining-corporation/StationPartsExpansionRedux


## Expanded inventory files
- `KSP1_STOCK_PARTS_EXPANSION.json`: 169 additional stock-family inventory candidates from the stock parts index.
- `KSP1_DLC_PARTS_CANDIDATES.json`: 97 named Making History / Breaking Ground candidates.
- `KSP1_PARTS_MODEL_AUDIT.json`: audit of the 128 current app entries; 124 candidate matches, 4 generic placeholders to replace, 0 exact `.cfg` verifications, 0 approved model assets.

These inventories are discovery/verification work, not an implemented replacement. Each row still needs its exact KSP 1.12.5 part.cfg, node/module data, model design, and license clearance before it can be activated in the editor.


## Current implementation status (2026-11-22)
- `parts-models.js`: integrated original geometry factory used for both the part-card previews and placed craft parts.
- `parts-inventory.js`: 277 additional candidates (169 stock-family + 97 DLC + 11 hidden legacy stock) merged into the in-game catalog, with source labels and provisional-data warnings.
- VAB cards now show the part name and source (base / stock / Making History / Breaking Ground).
- The new models are original approximations, not official KSP meshes. They are not exact KSP visual reproductions.
- The extra inventory entries are currently candidate records with provisional estimated stats. Exact 1.12.5 IDs, attachment nodes, module behaviors, and per-part official stats are not verified.
- 0 official KSP 3D assets are approved for redistribution; no proprietary meshes or textures have been copied.

- `KSP1_LEGACY_STOCK_PARTS.json`: 11 hidden legacy stock-part candidates for KSP 1.12.5.
- `export-ksp-part-configs.ps1`: Windows PowerShell exporter for exact local stock/DLC part config data; it does not copy model assets.
