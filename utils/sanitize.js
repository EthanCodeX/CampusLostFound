// utils/sanitize.js
/**
 * Simple input sanitizer to prevent basic XSS attacks.
 * Replaces <, >, &, ", ' with HTML entities.
 */

function sanitize(input) {
  if (!input) return "";
  return input
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = sanitize;