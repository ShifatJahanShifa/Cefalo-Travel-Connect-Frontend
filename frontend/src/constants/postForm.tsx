export const SectionNames = {
  ACCOMMODATIONS: "Accommodations",
  TRANSPORTS: "Transports",
  PLACES: "Places",
  FOODS: "Foods",
  IMAGES: "Images",
} as const;

export const FieldKeys = {
  // Accommodation Fields
  ACCOMMODATION_NAME: "accommodation_name",
  ACCOMMODATION_TYPE: "accommodation_type",

  // Transport Fields
  TRANSPORT_TYPE: "transport_type",
  TRANSPORT_NAME: "transport_name",

  // Place Fields
  PLACE_NAME: "place_name",

  // Food Fields
  FOOD_NAME: "food_name",

  // Image Fields
  IMAGE_URL: "image_url",
  CAPTION: "caption",

  // Shared Fields
  LATITUDE: "latitude",
  LONGITUDE: "longitude",
  COST: "cost",
  RATING: "rating",
  REVIEW: "review",
} as const;

// // Optional: You can also extract all keys as a union type for better TS support
// export type SectionName = typeof SectionNames[keyof typeof SectionNames];
// export type FieldKey = typeof FieldKeys[keyof typeof FieldKeys];
