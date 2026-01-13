'use client';

import ProductsList from "@/components/ProductsList";
import AccountDetails from "@/components/AccountDetails";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-6 text-black">
      <div className="max-w-xs">
        <AccountDetails />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pt-10">
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
