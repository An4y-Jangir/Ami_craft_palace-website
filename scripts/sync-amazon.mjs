#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PRODUCTS_SRC_PATH = path.join(rootDir, 'src', 'data', 'products.json');
const PRODUCTS_PUB_PATH = path.join(rootDir, 'public', 'data', 'products.json');

// Seller details
const SELLER_ID = process.env.AMAZON_SELLER_ID || 'A1PO2AXUX4A8XF';
const AMAZON_DOMAIN = 'amazon.in';
const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;

// Helper to slugify product titles into stable IDs
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Extract clean 10-character Amazon ASIN from any URL or string
function extractAsin(url) {
  if (!url) return null;
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

// Normalize title for resilient deduplication comparison
function normalizeTitle(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\b(ami\s+craft\s+palace|generic|pack\s+of\s+\d+|set\s+of\s+\d+)\b/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Automatically categorize products based on craftsmanship keywords
function determineCategory(title, description) {
  const combined = `${title || ''} ${description || ''}`.toLowerCase();
  const heritageKeywords = [
    'rakhi', 'lumba', 'lace', 'trim', 'patch', 'patches', 'tassel', 'tassels',
    'yarn', 'fabric', 'cord', 'rope', 'embroidery patch', 'gotta', 'zardozi'
  ];
  return heritageKeywords.some(kw => combined.includes(kw))
    ? 'Heritage Fabrics'
    : 'Home Accents';
}

// Automatically upgrade thumbnail Amazon image links to crystal-clear high-res
function optimizeAmazonImageUrl(url) {
  if (!url) return '/favicon.svg';
  return url.replace(/\._AC_[^.]+\./, '._AC_SL1200_.');
}

// Load existing products
function loadProducts() {
  if (fs.existsSync(PRODUCTS_SRC_PATH)) {
    return JSON.parse(fs.readFileSync(PRODUCTS_SRC_PATH, 'utf-8'));
  }
  return [];
}

// Deduplicate product catalog by ASIN, Title, Image, and Slug ID
function deduplicateProducts(products) {
  const seenAsins = new Set();
  const seenImages = new Set();
  const seenIds = new Set();
  const seenTitles = new Set();

  return products.filter(p => {
    if (!p || !p.title) return false;

    const asin = extractAsin(p.amazonUrl);
    const normTitle = normalizeTitle(p.title);
    const cleanId = p.id || slugify(p.title);

    // Prevent duplicate IDs
    if (cleanId && seenIds.has(cleanId)) return false;

    // Prevent duplicate ASINs
    if (asin && seenAsins.has(asin)) return false;

    // Prevent duplicate normalized titles
    if (normTitle && seenTitles.has(normTitle)) return false;

    // Prevent duplicate images (ignore local assets or fallback favicons)
    if (p.image && !p.image.startsWith('/images/') && p.image !== '/favicon.svg' && seenImages.has(p.image)) {
      return false;
    }

    if (cleanId) seenIds.add(cleanId);
    if (asin) seenAsins.add(asin);
    if (normTitle) seenTitles.add(normTitle);
    if (p.image && !p.image.startsWith('/images/') && p.image !== '/favicon.svg') {
      seenImages.add(p.image);
    }

    return true;
  });
}

// Save products to both src and public with guaranteed deduplication
function saveProducts(products) {
  const cleanList = deduplicateProducts(products);
  const jsonStr = JSON.stringify(cleanList, null, 2);
  fs.mkdirSync(path.dirname(PRODUCTS_SRC_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(PRODUCTS_PUB_PATH), { recursive: true });
  fs.writeFileSync(PRODUCTS_SRC_PATH, jsonStr, 'utf-8');
  fs.writeFileSync(PRODUCTS_PUB_PATH, jsonStr, 'utf-8');
  console.log(`Saved ${cleanList.length} unique, deduplicated products to products.json`);
}

// Fetch storefront listings using Rainforest API (Supports multi-page storefront pagination)
async function fetchStorefrontListings(apiKey, sellerId) {
  let allItems = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const url = `https://api.rainforestapi.com/request?api_key=${apiKey}&type=seller_products&seller_id=${sellerId}&amazon_domain=${AMAZON_DOMAIN}&page=${currentPage}`;
    console.log(`Querying Rainforest API for seller ${sellerId} on ${AMAZON_DOMAIN} (page ${currentPage} of ${totalPages || '?'})...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Rainforest API warning on page ${currentPage}: ${response.status} ${response.statusText}`);
        break;
      }

      const data = await response.json();
      const items = data.seller_products || [];
      console.log(`Page ${currentPage}: retrieved ${items.length} products.`);

      if (items.length === 0) {
        break;
      }

      allItems = allItems.concat(items);

      if (data.pagination?.total_pages) {
        totalPages = data.pagination.total_pages;
      } else {
        break;
      }

      currentPage++;
      if (currentPage <= totalPages) {
        // Small delay between page requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (err) {
      console.warn(`Error on page ${currentPage}: ${err.message}`);
      break;
    }
  }

  return allItems;
}

// Fetch a single ASIN product details (via Rainforest API or direct)
async function fetchAsinDetails(apiKey, asin) {
  const url = `https://api.rainforestapi.com/request?api_key=${apiKey}&type=product&asin=${asin}&amazon_domain=${AMAZON_DOMAIN}`;
  console.log(`Fetching details for ASIN ${asin}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Rainforest API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.product || null;
}

// Main sync routine
async function main() {
  const args = process.argv.slice(2);
  const asinArg = args.find((_, i) => args[i - 1] === '--asin');
  const urlArg = args.find((_, i) => args[i - 1] === '--url');

  const existingProducts = loadProducts();
  console.log(`Loaded ${existingProducts.length} existing products.`);

  // 1. Single ASIN / URL manual add mode
  if (asinArg || urlArg) {
    let targetAsin = asinArg;
    if (urlArg) {
      const match = urlArg.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (match) targetAsin = match[1];
    }

    if (!targetAsin) {
      console.error('Could not extract valid ASIN from argument.');
      process.exit(1);
    }

    console.log(`Processing ASIN: ${targetAsin}`);

    if (!RAINFOREST_API_KEY) {
      console.log('\n[INFO] To fetch automatic live data for this ASIN, set RAINFOREST_API_KEY in your environment or .env file.');
      console.log('You can get a free API key with 100 requests/month at: https://rainforestapi.com');
      return;
    }

    try {
      const productData = await fetchAsinDetails(RAINFOREST_API_KEY, targetAsin);
      if (!productData) {
        console.error('No product data returned for ASIN:', targetAsin);
        return;
      }

      const priceVal = productData.buybox_winner?.price?.value || productData.prices?.[0]?.value;
      const mrpVal = productData.buybox_winner?.rrp?.value || productData.rrp?.value;
      const discount = mrpVal && priceVal ? `${Math.round((1 - priceVal / mrpVal) * 100)}% off` : undefined;

      const category = determineCategory(productData.title, productData.description || productData.feature_bullets_flat);
      const id = slugify(productData.title || targetAsin);
      const newProduct = {
        id,
        title: productData.title,
        badge: 'New Arrival',
        price: priceVal ? `₹${priceVal.toFixed(2)}` : 'Check on Amazon',
        mrp: mrpVal ? `₹${mrpVal.toFixed(2)}` : undefined,
        discount,
        image: optimizeAmazonImageUrl(productData.main_image?.link || productData.images?.[0]?.link),
        description: productData.feature_bullets_flat || productData.title,
        longDescription: productData.description || productData.feature_bullets_flat || productData.title,
        category,
        amazonUrl: productData.link || `https://www.amazon.in/dp/${targetAsin}`,
        details: {
          materials: productData.specifications_flat || 'Artisanal Handcrafted Materials',
          dimensions: productData.dimensions || 'Standard'
        }
      };

      const existingIdx = existingProducts.findIndex(p => {
        const pAsin = extractAsin(p.amazonUrl);
        return (targetAsin && pAsin && targetAsin === pAsin) ||
               (p.id === id) ||
               (normalizeTitle(p.title) === normalizeTitle(newProduct.title)) ||
               (newProduct.image && p.image === newProduct.image);
      });

      if (existingIdx !== -1) {
        existingProducts[existingIdx] = { ...existingProducts[existingIdx], ...newProduct };
        console.log(`Updated existing product: "${newProduct.title}"`);
      } else {
        existingProducts.push(newProduct);
        console.log(`Added new product to catalog: "${newProduct.title}"`);
      }

      saveProducts(existingProducts);
    } catch (err) {
      console.error('Error fetching ASIN details:', err.message);
    }
    return;
  }

  // 2. Automated Storefront Sync Mode
  if (!RAINFOREST_API_KEY) {
    console.log('================================================================');
    console.log('AMI CRAFT PALACE - AMAZON STOREFRONT SYNC');
    console.log('================================================================');
    console.log(`Storefront Seller ID: ${SELLER_ID}`);
    console.log(`Storefront URL: https://www.amazon.in/storefront?me=${SELLER_ID}`);
    console.log('\n[NOTICE] RAINFOREST_API_KEY is not set in environment.');
    console.log('To automatically synchronize your entire Amazon Storefront:');
    console.log('1. Get a free API key at: https://rainforestapi.com (100 free requests/month)');
    console.log('2. Add it to your environment or GitHub Secrets: RAINFOREST_API_KEY=your_key');
    console.log('3. Run `npm run sync` or let the automated GitHub Action run on schedule.\n');
    console.log(`Existing catalog has ${existingProducts.length} unique products and is running normally.`);
    return;
  }

  try {
    const rawItems = await fetchStorefrontListings(RAINFOREST_API_KEY, SELLER_ID);
    console.log(`Found ${rawItems.length} listings in Amazon Storefront.`);

    let addedCount = 0;
    let updatedCount = 0;

    for (const item of rawItems) {
      if (!item.title || !item.asin) continue;

      const asin = item.asin.toUpperCase();
      const itemTitleNorm = normalizeTitle(item.title);
      const itemImage = optimizeAmazonImageUrl(item.image);
      const category = determineCategory(item.title, item.description || '');

      const existingIdx = existingProducts.findIndex(p => {
        const pAsin = extractAsin(p.amazonUrl);
        if (asin && pAsin && asin === pAsin) return true;
        if (p.amazonUrl && asin && p.amazonUrl.includes(asin)) return true;
        if (p.id === slugify(item.title)) return true;
        if (itemTitleNorm && normalizeTitle(p.title) === itemTitleNorm) return true;
        if (itemImage && p.image && itemImage !== '/favicon.svg' && !p.image.startsWith('/images/') && p.image === itemImage) return true;
        return false;
      });

      const priceVal = item.price?.value;
      const mrpVal = item.rrp?.value;
      const discount = mrpVal && priceVal ? `${Math.round((1 - priceVal / mrpVal) * 100)}% off` : undefined;

      if (existingIdx !== -1) {
        // Update price, discount, rating if changed
        if (priceVal) existingProducts[existingIdx].price = `₹${priceVal.toFixed(2)}`;
        if (mrpVal) existingProducts[existingIdx].mrp = `₹${mrpVal.toFixed(2)}`;
        if (discount) existingProducts[existingIdx].discount = discount;
        if (item.rating) existingProducts[existingIdx].ratingScore = item.rating;
        if (existingProducts[existingIdx].category === 'Home Accents' && category !== 'Home Accents') {
          existingProducts[existingIdx].category = category;
        }
        updatedCount++;
      } else {
        // Add new unique product
        const newProduct = {
          id: slugify(item.title),
          title: item.title,
          badge: 'Amazon Storefront',
          price: priceVal ? `₹${priceVal.toFixed(2)}` : 'Check on Amazon',
          mrp: mrpVal ? `₹${mrpVal.toFixed(2)}` : undefined,
          discount,
          ratingScore: item.rating,
          ratingText: item.rating ? `${item.rating} (${item.ratings_total || 1} reviews)` : undefined,
          image: itemImage,
          description: item.title,
          longDescription: `Handcrafted creation from the AMI Craft Palace collection, available directly on our Amazon Storefront.`,
          category,
          amazonUrl: item.link || `https://www.amazon.in/dp/${asin}?m=${SELLER_ID}`,
          details: {
            materials: 'Artisanal Handcrafted Materials',
            dimensions: 'Standard'
          }
        };

        existingProducts.push(newProduct);
        addedCount++;
        console.log(`+ Discovered new unique storefront listing: "${item.title}" (${asin})`);
      }
    }

    saveProducts(existingProducts);
    console.log(`Sync completed! Added: ${addedCount}, Updated: ${updatedCount}`);
  } catch (err) {
    console.error('Error syncing storefront:', err.message);
  }
}

main();
