import { changeDemo, runPortfolio } from "../lib/engine";

const portfolio = runPortfolio();
const matrix: Record<string, string> = {};
for (const cell of portfolio.matrix) {
  matrix[`${cell.sku}|${cell.country}|${cell.platform}`] = cell.status;
}
const change = changeDemo();
process.stdout.write(JSON.stringify({
  matrix,
  affected: change.impact.affected_skus,
  product_count: portfolio.products.length,
  cell_count: portfolio.matrix.length,
}));
