import Link from "next/link";

import { mockProducts } from "@/data/mockProducts";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Products
          </h1>
          <p className="text-xs text-black/70 sm:text-sm lg:text-base">
            Start a new campaign for a product.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
            >
              <span className="text-sm font-semibold sm:text-base lg:text-lg">
                {product.name}
              </span>
              <Link
                href={`/campaigns/new?productId=${product.id}`}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm lg:text-base"
              >
                Add campaign
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
