const CATEGORY_FIELDS = {
  hoarding: [
    { id: "height", label: "Height (ft)", type: "number", required: true },
    { id: "width", label: "Width (ft)", type: "number", required: true },
    { id: "lighting", label: "Lighting Type", type: "dropdown", options: ["Lit", "Non-Lit", "Front Lit", "Back Lit"] },
  ],
  digital_billboard: [
    { id: "resolution", label: "Screen Resolution", type: "text", required: true },
    { id: "operatingHours", label: "Operating Hours", type: "text", required: true },
  ],
  bus_advertisement: [
    { id: "busRoute", label: "Bus Route / Zone", type: "text", required: true },
    { id: "wrapType", label: "Wrap Type", type: "dropdown", options: ["Full Body", "Side Panel", "Back Panel"] },
  ],
};

export default CATEGORY_FIELDS;
