'use client';

import ProductsList from "@/components/ProductsList";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12 text-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Your Products
          </h1>
          <p className="text-xs text-black/70 sm:text-sm lg:text-base">
            Start a new campaign for a product.
          </p>
        </header>

        <ProductsList />
      </div>
    </div>
  );
}
