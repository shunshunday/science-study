# KSP1 Parts Master Inventory

Updated: 2026-11-22

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
