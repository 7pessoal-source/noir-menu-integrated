import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Plus, Trash2, MapPin, Phone, Wallet } from 'lucide-react';

interface MenuConfig {
  id?: string;
  whatsapp_number: string;
  minimum_order: number;
  neighborhoods: string[];
}

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<MenuConfig>({
    whatsapp_number: '',
    minimum_order: 0,
    neighborhoods: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNeighborhood, setNewNeighborhood] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('menu_config').select('*').single();
    
    if (data) {
      setConfig(data);
    } else if (error && error.code === 'PGRST116') {
      // Se não existir, criamos um registro inicial
      const { data: newData } = await supabase.from('menu_config').insert([{
        whatsapp_number: '5500000000000',
        minimum_order: 0,
        neighborhoods: []
      }]).select().single();
      if (newData) setConfig(newData);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('menu_config')
        .update({
          whatsapp_number: config.whatsapp_number,
          minimum_order: config.minimum_order,
          neighborhoods: config.neighborhoods
        })
        .eq('id', config.id);

      if (error) throw error;
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar configurações.');
    }
    setSaving(false);
  };

  const addNeighborhood = () => {
    if (!newNeighborhood.trim()) return;
    if (config.neighborhoods.includes(newNeighborhood.trim())) {
      alert('Este bairro já está na lista.');
      return;
    }
    setConfig({
      ...config,
      neighborhoods: [...config.neighborhoods, newNeighborhood.trim()]
    });
    setNewNeighborhood('');
  };

  const removeNeighborhood = (name: string) => {
    setConfig({
      ...config,
      neighborhoods: config.neighborhoods.filter(n => n !== name)
    });
  };

  if (loading) return <div className="text-white p-10">Carregando configurações...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">Configurações</h1>
          <p className="text-zinc-500">Ajuste os detalhes do seu negócio e entrega.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-zinc-950 font-bold px-8 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* WhatsApp Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 text-zinc-100">
              <Phone className="w-5 h-5" />
              <h2 className="font-bold text-lg uppercase">Recebimento de Pedidos</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">WhatsApp do Estabelecimento</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="5511999999999"
                  value={config.whatsapp_number}
                  onChange={e => setConfig({...config, whatsapp_number: e.target.value})}
                />
                <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider">Inclua código do país e DDD (apenas números)</p>
              </div>
            </div>
          </div>

          {/* Business Rules */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 text-zinc-100">
              <Wallet className="w-5 h-5" />
              <h2 className="font-bold text-lg uppercase">Regras de Negócio</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Pedido Mínimo (R$)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  value={config.minimum_order}
                  onChange={e => setConfig({...config, minimum_order: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhoods */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 text-zinc-100">
            <MapPin className="w-5 h-5" />
            <h2 className="font-bold text-lg uppercase">Bairros Atendidos</h2>
          </div>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
              placeholder="Nome do bairro..."
              value={newNeighborhood}
              onChange={e => setNewNeighborhood(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNeighborhood()}
            />
            <button 
              onClick={addNeighborhood}
              className="p-3 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {config.neighborhoods.length === 0 ? (
              <p className="text-zinc-600 text-sm italic text-center py-4">Nenhum bairro cadastrado.</p>
            ) : (
              config.neighborhoods.map(n => (
                <div key={n} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg group">
                  <span className="text-zinc-300 font-medium">{n}</span>
                  <button 
                    onClick={() => removeNeighborhood(n)}
                    className="p-1 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
