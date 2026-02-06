import { useState, useEffect } from 'react';
import { supabase } from '@/admin/lib/supabase';
import type { 
  RestaurantConfig, 
  DeliveryConfig, 
  Product, 
  Neighborhood, 
  PaymentMethod 
} from '@/types/menu';

interface UseSupabaseMenuReturn {
  restaurantConfig: RestaurantConfig | null;
  deliveryConfig: DeliveryConfig | null;
  products: Product[];
  neighborhoods: Neighborhood[];
  paymentMethods: PaymentMethod[];
  categories: Array<{ id: string; name: string }>;
  loading: boolean;
  error: Error | null;
}

export function useSupabaseMenu(): UseSupabaseMenuReturn {
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig | null>(null);
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar Categorias
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('order', { ascending: true });
        
        if (catError) throw catError;

        // 2. Buscar Produtos
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('available', true);
        
        if (prodError) throw prodError;

        // 3. Buscar Configurações (menu_config)
        const { data: configData, error: configError } = await supabase
          .from('menu_config')
          .select('*')
          .single();
        
        if (configError && configError.code !== 'PGRST116') throw configError;

        // Processar Categorias
        const processedCategories = [
          { id: 'all', name: 'Todos' },
          ...(categoriesData?.map(cat => ({ id: cat.id, name: cat.name })) || [])
        ];
        setCategories(processedCategories);

        // Processar Produtos
        const processedProducts: Product[] = productsData?.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: Number(p.price),
          category: p.category_id,
          image: p.image_url || undefined
        })) || [];
        setProducts(processedProducts);

        // Processar Configurações e Bairros (da tabela menu_config)
        if (configData) {
          setRestaurantConfig({
            name: "Noir Menu", // Nome fixo ou vindo de outra parte se preferir
            tagline: "Seu cardápio digital",
            whatsappNumber: configData.whatsapp_number || "",
            schedule: {
              isOpen: true, // Valor padrão já que não tem na tabela atual
              openTime: "18:00",
              closeTime: "23:00",
              workingDays: "Todos os dias",
              closedMessage: "Estamos fechados no momento."
            }
          });

          setDeliveryConfig({
            minimumOrder: Number(configData.minimum_order) || 0,
            minimumOrderEnabled: Number(configData.minimum_order) > 0,
            estimatedTime: "30-50 min"
          });

          // Converter array de strings de bairros para o formato do cardápio
          const processedNeighborhoods: Neighborhood[] = (configData.neighborhoods || []).map((name: string, index: number) => ({
            id: `n-${index}`,
            name: name,
            deliveryFee: 0 // Taxa zero por padrão já que a tabela atual não armazena taxas individuais
          }));
          setNeighborhoods(processedNeighborhoods);
        }

        // Formas de pagamento fixas
        setPaymentMethods([
          { id: "dinheiro", name: "Dinheiro", icon: "banknote" },
          { id: "pix", name: "Pix", icon: "qr-code" },
          { id: "cartao", name: "Cartão", icon: "credit-card" },
        ]);

      } catch (err) {
        console.error('Erro ao buscar dados do Supabase:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }

    fetchMenuData();

    // Realtime subscriptions
    const channels = [
      supabase.channel('public:products').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchMenuData()),
      supabase.channel('public:categories').on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchMenuData()),
      supabase.channel('public:menu_config').on('postgres_changes', { event: '*', schema: 'public', table: 'menu_config' }, () => fetchMenuData())
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return {
    restaurantConfig,
    deliveryConfig,
    products,
    neighborhoods,
    paymentMethods,
    categories,
    loading,
    error,
  };
}
