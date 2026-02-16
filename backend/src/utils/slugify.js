/**
 * Convert string to URL-friendly slug
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
};

/**
 * Generate unique slug
 */
const generateUniqueSlug = async (baseSlug, checkExists) => {
  let slug = slugify(baseSlug);
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${slugify(baseSlug)}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = {
  slugify,
  generateUniqueSlug
};
