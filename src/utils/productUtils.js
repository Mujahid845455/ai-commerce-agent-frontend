export function getProductImage(product) {
  const imageUrl = product?.image_url || product?.attributes?.image_url;
  if (imageUrl) return imageUrl;

  const name = (product?.name || "").toLowerCase();
  const category = (product?.category || "").toLowerCase();

  // Mobiles & Smartphones
  if (name.includes("iphone") || name.includes("apple") || category.includes("mobile") || category.includes("smartphone")) {
    if (name.includes("pro max") || name.includes("titanium")) {
      return "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80";
    }
    if (name.includes("white")) {
      return "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("samsung") || name.includes("galaxy")) {
    return "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("pixel") || name.includes("oneplus") || name.includes("xiaomi") || name.includes("realme") || name.includes("phone")) {
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80";
  }

  // Laptops
  if (name.includes("macbook") || name.includes("laptop") || name.includes("dell") || name.includes("hp") || name.includes("lenovo") || name.includes("asus") || category.includes("laptop")) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80";
  }

  // Audio
  if (name.includes("airpods") || name.includes("earbuds") || name.includes("headphone") || name.includes("sony wh") || category.includes("audio")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
  }

  // Smartwatches
  if (name.includes("watch") || name.includes("garmin") || category.includes("wearable")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80";
  }

  // Cameras
  if (name.includes("camera") || name.includes("canon") || name.includes("sony alpha") || name.includes("nikon") || name.includes("gopro") || category.includes("camera")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80";
  }

  // Computer Accessories
  if (name.includes("mouse") || name.includes("keyboard") || name.includes("hub") || category.includes("computer accessories")) {
    return "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80";
  }

  // Fashion - Men / Women
  if (category.includes("men") || category.includes("women") || name.includes("shirt") || name.includes("kurti") || name.includes("dress") || name.includes("jeans") || name.includes("jacket")) {
    return "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop&q=80";
  }

  // Home & Kitchen / Appliances
  if (category.includes("home") || category.includes("kitchen") || category.includes("appliance")) {
    return "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80";
  }

  // Grocery
  if (category.includes("grocery") || name.includes("rice") || name.includes("atta") || name.includes("chocolate") || name.includes("tea") || name.includes("coffee")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
  }

  // Accessories & Shoes
  if (name.includes("sock")) return "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&auto=format&fit=crop&q=80";
  if (name.includes("bottle")) return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80";

  if (name.includes("campus")) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80";
  if (name.includes("sparx")) return "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=80";
  if (name.includes("asian")) return "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&auto=format&fit=crop&q=80";
  if (name.includes("runner") || name.includes("shoe") || category.includes("shoes") || category.includes("running")) {
    return "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop&q=80";
  }

  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80";
}

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
