export function calculateMatch(product) {
  const category = String(product.category || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();
  const description = String(product.description || "").toLowerCase();

  let score = 70;

  if (
    category.includes("running") ||
    name.includes("running") ||
    description.includes("running")
  ) {
    score += 10;
  }

  if (description.includes("daily") || description.includes("lightweight")) {
    score += 7;
  }

  if (Number(product.price_paise || 0) <= 250000) {
    score += 8;
  }

  if (Number(product.stock_quantity || 0) > 0) {
    score += 5;
  }

  return Math.min(score, 99);
}

export function normalizeProduct(product) {
  const attributes = product.attributes || {};

  const pricePaise = Number(product.price_paise ?? 0);
  const stock = Number(product.stock_quantity ?? 0);

  return {
    ...product,

    price: pricePaise / 100,
    pricePaise,

    stock,
    stock_quantity: stock,

    image_url: product.image_url || attributes.image_url || null,

    color: attributes.color || attributes.colour || "Standard",

    size: attributes.size || "Standard",

    brand: attributes.brand || "Generic",

    activity: attributes.activity || "General",

    fit: attributes.fit || "Regular",

    aiTags: Array.isArray(attributes.ai_tags) ? attributes.ai_tags : [],

    match: calculateMatch(product),
  };
}
