async function run() {
const nodes = figma.root.findAll(n =>
(n.type === "COMPONENT" || n.type === "COMPONENT_SET")
);

// verzamel alleen gepubliceerde componenten met een key
const items = [];
for (const n of nodes) {
const key = n.key; // bestaat alleen als gepubliceerd
if (!key) continue;
const name = n.type === "COMPONENT_SET" ? n.name : n.name;
items.push({ name, key });
}

if (items.length === 0) {
figma.closePlugin("Geen gepubliceerde componenten met key gevonden.");
return;
}

// sorteer en maak mapping
items.sort((a, b) => a.name.localeCompare(b.name));

// eenvoudige mapping: ComponentNaam: "key"
let out = "const mapping = {\n";
for (const { name, key } of items) {
  // normaliseer naam tot een simpele sleutel, bv. zonder spaties of slashes
  const simple = name.replace(/\s+/g, "").replace(/\//g, "");
  out += `  ${simple}: "${key}", // ${name}\n`;
}
out += "};\n";

// toon in een nieuw page-node als tekst voor makkelijke copy
const page = figma.currentPage;
const frame = figma.createFrame();
frame.name = "Export mapping";
frame.resize(1000, 1000);
page.appendChild(frame);

const text = figma.createText();
frame.appendChild(text);

try {
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
} catch (e) {}
text.characters = out;
text.textAutoResize = "HEIGHT";
text.resize(960, text.height);
text.x = 20;
text.y = 20;

figma.closePlugin("Mapping geplaatst op canvas in ‘Export mapping’. Kopieer die code.");
}
run();