async function run() {
  // 🔑 Whitelist met alleen de top-level blokken
  const whitelist = [
    "Hero",
    "Media Groot",
    "Kolommen",
    "Media Slider",
    "Grid",
    "Entry/Post Slider",
    "Logo Slider",
    "Call to Action",
    "Footer",
    "Projects",
    "News",
  ];

  const nodes = figma.root.findAll(
    (n) => (n.type === "COMPONENT_SET" || n.type === "COMPONENT") && n.key
  );

  const items = [];
  for (const n of nodes) {
    if (whitelist.includes(n.name)) {
      items.push({ name: n.name, key: n.key });
    }
  }

  if (items.length === 0) {
    figma.closePlugin("Geen whitelisted componenten gevonden.");
    return;
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  let out = "const mapping = {\n";
  for (const { name, key } of items) {
    const simple = name.replace(/\s+/g, "").replace(/\//g, "");
    out += `  ${simple}: "${key}", // ${name}\n`;
  }
  out += "};\n";

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

  figma.closePlugin(
    "Mapping geplaatst op canvas in ‘Export mapping’. Kopieer die code."
  );
}

run();
