export interface Category {
  title: string;
  items: string[]; // You can change this later if needed
}

export const boneCategories: Category[] = [
  
    { title: "Carpals", items: [
    "Scaphoid",
    "Lunate",
    "Triquetrum",
    "Pisiform",
    "Trapezium",
    "Trapezoid",
    "Capitate",
    "Hamate"
  ] },
  { title: "Tarsals", items: [
    "Calcaneus",
    "Talus",
    "Navicular",
    "Medial Cuneiform",
    "Intermediate Cuneiform",
    "Lateral Cuneiform",
    "Cuboid"
  ] },
  { title: "Metacarpals", items: [
    "MC1",
    "MC2",
    "MC3",
    "MC4",
    "MC5"
  ] },
  { title: "Metatarsals", items: [
    "MT1",
    "MT2",
    "MT3",
    "MT4",
    "MT5"
  ] },
  { title: "Hand Phalanges", items: [] },
  { title: "Foot Phalanges", items: [] },
];
