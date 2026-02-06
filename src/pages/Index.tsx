import { useState, useMemo } from "react";
import { Header } from "@/components/menu/Header";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { Cart } from "@/components/menu/Cart";
import { Checkout } from "@/components/menu/Checkout";
import { useCart } from "@/hooks/useCart";
import { useSupabaseMenu } from "@/hooks/useSupabaseMenu";
import { 
  NEIGHBORHOODS as FALLBACK_NEIGHBORHOODS, 
  DELIVERY_CONFIG as FALLBACK_DELIVERY_CONFIG,
  CATEGORIES as FALLBACK_CATEGORIES,
  PRODUCTS as FALLBACK_PRODUCTS,
} from "@/config/menuConfig";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);
  
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  // Busca dados do Supabase
  const {
    products: supabaseProducts,
    neighborhoods: supabaseNeighborhoods,
    deliveryConfig: supabaseDeliveryConfig,
    categories: supabaseCategories,
    loading,
    error,
  } = useSupabaseMenu();

  // Usa dados do Supabase se disponíveis, senão usa fallback do menuConfig.ts
  const products = useMemo(() => {
    return supabaseProducts.length > 0 ? supabaseProducts : FALLBACK_PRODUCTS;
  }, [supabaseProducts]);

  const neighborhoods = useMemo(() => {
    return supabaseNeighborhoods.length > 0 ? supabaseNeighborhoods : FALLBACK_NEIGHBORHOODS;
  }, [supabaseNeighborhoods]);

  const deliveryConfig = useMemo(() => {
    return supabaseDeliveryConfig || FALLBACK_DELIVERY_CONFIG;
  }, [supabaseDeliveryConfig]);

  const categories = useMemo(() => {
    return supabaseCategories.length > 0 ? supabaseCategories : FALLBACK_CATEGORIES;
  }, [supabaseCategories]);

  const handleCheckoutComplete = () => {
    clearCart();
    setShowCheckout(false);
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground font-medium">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Products Grid */}
      <ProductGrid
        selectedCategory={selectedCategory}
        onAddProduct={addItem}
        products={products}
      />

      {/* Delivery Info Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="text-center space-y-4">
            <h3 className="font-display text-lg text-primary">Bairros que atendemos</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {neighborhoods.map((n) => (
                <span
                  key={n.id}
                  className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {n.name}
                </span>
              ))}
            </div>
            {deliveryConfig.minimumOrderEnabled && (
              <p className="text-muted-foreground text-sm">
                Pedido mínimo:{" "}
                {deliveryConfig.minimumOrder.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Cart */}
      <Cart
        items={items}
        subtotal={subtotal}
        totalItems={totalItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={() => setShowCheckout(true)}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          items={items}
          subtotal={subtotal}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCheckoutComplete}
          neighborhoods={neighborhoods}
          deliveryConfig={deliveryConfig}
        />
      )}
    </div>
  );
};

export default Index;
