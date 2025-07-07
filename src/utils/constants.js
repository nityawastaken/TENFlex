export const defaultGig = {
  service_text:
    "Our agency will be full stack web developer software developer PHP laravel html react nodejs",
  gig_id: "GIG12345",
  user_id: "USER67890",
  avg_rating: 5.0,
  total_reviews: 235,
  price: "70,242",
  currency: "₹",
  delivery_time: "10-day delivery",
  revisions: "Unlimited Revisions",
  seller: {
    name: "DevScout Agency",
    avatar: "https://via.placeholder.com/50",
  },
  image: "https://picsum.photos/700/400",
};

export const packages = {
  basic: {
    title: "Basic Package",
    price: defaultGig.price,
    description: "", // Basic package has no description visible in the screenshot
    delivery_text: "Delivery", // New property for simple "Delivery" text
    continue_price_display: `(${defaultGig.currency}${defaultGig.price})`, // Text for continue button
    gig_id: defaultGig.gig_id,
  },
  standard: {
    title: "Standard Package",
    price: (parseInt(defaultGig.price.replace(/,/g, "")) + 15000).toLocaleString(), // Increased price
    description:
      "Interactive 15 Page Design & Development + Redux + Advanced API Integration + Medium Functionality", // Placeholder
    delivery_time: "15-day delivery", // Placeholder for when description is active
    revisions: "Unlimited Revisions",
    gig_id: defaultGig.gig_id,
  },
  premium: {
    title: "Premium Web Application",
    price: (parseInt(defaultGig.price.replace(/,/g, "")) + 30000).toLocaleString(), // Further increased price
    description:
      "Interactive 8 Page Design & Development + Redux + Provided API Integration + Basic Functionality",
    delivery_time: "10-day delivery",
    revisions: "Unlimited Revisions",
    gig_id: defaultGig.gig_id,
  },
};
