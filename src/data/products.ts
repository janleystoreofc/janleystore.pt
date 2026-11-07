import { Category, Product, ProductColor } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'natal',
    name: 'Natal',
    image: '/assets/aistudio/Natal_3D_com_Luzes_Aconchegantes_8827239d.png',
    description: 'Árvores decorativas, estrelas e enfeites de Natal em filamento biodegradável.',
  },
  {
    id: 'chaveiros',
    name: 'Chaveiros',
    image: '/assets/aistudio/Chaveiro_de_l_bios_vermelhos_c24316a4.png',
    description: 'Chaveiros de letras, corações e monogramas personalizados com alta definição.',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    image: '/assets/aistudio/Suporte_Magenta_para_Controle_PlayStation_4046085c.png',
    description: 'Suportes para comandos PlayStation/Xbox e auscultadores de gaming.',
  },
  {
    id: 'personalizados',
    name: 'Personalizados',
    image: '/assets/aistudio/Chaveiros_Personalizados_Emma_e_Jade_b2f99a98.png',
    description: 'Nomes decorativos, logótipos 3D, datas especiais e presentes exclusivos.',
  },
  {
    id: 'decoracao',
    name: 'Decoração',
    image: '/assets/aistudio/Conjunto_Decorativo_de_Pampas_e_Vela_b4436603.png',
    description: 'Vasos ondulados, bandejas minimalistas e peças de arte moderna.',
  },
  {
    id: 'lazer',
    name: 'Lazer',
    image: '/images/cat_lazer.jpg',
    description: 'Jogos de tabuleiro, puzzles mecânicos, dados e gadgets anti-stress.',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    image: '/assets/aistudio/Drag_o_Arco-_ris_em_Espiral_793e526b.png',
    description: 'Luminárias de quarto, puxadores temáticos e brinquedos didáticos seguros.',
  },
  {
    id: 'organizacao',
    name: 'Organização',
    image: '/images/cat_organizacao.png',
    description: 'Porta-lápis canelados, caixas modulares e organizadores de secretária.',
  },
  {
    id: 'casa',
    name: 'Casa',
    image: '/images/cat_casa.jpg',
    description: 'Porta-guardanapos, bases para copos, apoios e utilitários modernos.',
  },
  {
    id: 'futebol',
    name: 'Futebol',
    image: '/images/cat_futebol.jpg',
    description: 'Troféus geométricos, porta-chaves de clubes de futebol e símbolos desportivos.',
  },
  {
    id: 'empresas',
    name: 'Empresas',
    image: '/assets/aistudio/Placa_de_Enfermagem_Leonardo_04c49766.png',
    description: 'Brindes corporativos com logótipo, suportes de balcão e placas com QR Code.',
  },
  {
    id: 'outros',
    name: 'Outros / Etc',
    image: '/images/cat_outros.jpg',
    description: 'Peças técnicas de reposição, utilitários sob encomenda e projetos especiais.',
  },
];
export const JANLEY_COLORS: ProductColor[] = [
  {
    name: 'Dourado',
    hex: '#f5b82a',
    gradient: 'linear-gradient(135deg, #ffe066 0%, #f5b82a 50%, #cb8402 100%)',
    isGradient: true,
  },
  {
    name: 'Rosa Gradiente Preto',
    hex: '#e11d68',
    gradient: 'linear-gradient(135deg, #f0257c 0%, #ba165c 45%, #180912 100%)',
    isGradient: true,
  },
  {
    name: 'Roxo Gradiente Preto',
    hex: '#8b1da8',
    gradient: 'linear-gradient(135deg, #a81db5 0%, #751582 45%, #18091c 100%)',
    isGradient: true,
  },
  {
    name: 'Mármore',
    hex: '#e8e7e3',
    gradient: 'radial-gradient(circle, #ffffff 20%, #e6e5e0 60%, #cecdc8 100%)',
    isMarble: true,
  },
  {
    name: 'Branco',
    hex: '#ffffff',
  },
  {
    name: 'Preto',
    hex: '#1a1a1a',
  },
  {
    name: 'Cinza',
    hex: '#83878b',
  },
  {
    name: 'Amarelo',
    hex: '#f7c700',
  },
  {
    name: 'Laranja Intenso',
    hex: '#ff5500',
  },
  {
    name: 'Vermelho',
    hex: '#d91424',
  },
  {
    name: 'Rosa Claro',
    hex: '#fbcfe8',
  },
  {
    name: 'Rosa Coral',
    hex: '#f87171',
  },
  {
    name: 'Roxo',
    hex: '#7c3aed',
  },
  {
    name: 'Azul Royal',
    hex: '#1d4ed8',
  },
  {
    name: 'Azul-Celeste',
    hex: '#38bdf8',
  },
  {
    name: 'Verde',
    hex: '#009b48',
  },
  {
    name: 'Verde Oliva',
    hex: '#6b8e23',
  },
  {
    name: 'Castanho',
    hex: '#8b5a2b',
  },
  {
    name: 'Marrom',
    hex: '#4a2c16',
  },
  {
    name: 'Verde Salva',
    hex: '#447b52',
  },
  {
    name: 'Azul Hortênsia',
    hex: '#90a4cb',
  },
];

// Specific colors with real variant photos for the Vaso Decorativo
export const VASO_COLORS: ProductColor[] = JANLEY_COLORS.map((c) => {
  if (c.name === 'Dourado') return { ...c, sampleImage: '/images/vaso_dourado_amarelo.png' };
  if (c.name === 'Rosa Gradiente Preto') return { ...c, sampleImage: '/images/vaso_pink_gradiente_preto.png' };
  if (c.name === 'Roxo Gradiente Preto') return { ...c, sampleImage: '/images/vaso_roxo_gradiente_preto.png' };
  if (c.name === 'Mármore') return { ...c, sampleImage: '/images/vaso_marmore.png' };
  return c;
});

/**
 * Safely resolves the product photo for a selected color.
 * - Each product maintains its own photo.
 * - Only changes if a verified photo of THIS specific product in this color exists.
 * - Never shows photos of other products (e.g. vase photos on phone stands or keychains).
 * - Defaults to product.image when no specific photo exists for that color.
 */
export function getProductImageForColor(product: Product, color?: ProductColor): string {
  if (!product) return '/images/prod_suporte_telemovel.png';

  const defaultImage = product.image || (Array.isArray(product.images) && product.images[0]) || '/images/prod_suporte_telemovel.png';

  if (!color || !color.sampleImage) {
    return defaultImage;
  }

  const sampleUrl = color.sampleImage.toLowerCase();
  const prodId = (product.id || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();

  // Guard against foreign vase images on non-vase products
  const isVaseImage = sampleUrl.includes('vaso_') || sampleUrl.includes('prod_vaso');
  const isVaseProduct = prodId.includes('vaso') || prodName.includes('vaso');

  if (isVaseImage && !isVaseProduct) {
    return defaultImage;
  }

  return color.sampleImage;
}

export const PRODUCTS: Product[] = [
  {
    id: 'suporte-telemovel',
    name: 'Suporte de Telemóvel',
    category: 'Organização',
    categoryId: 'organizacao',
    price: 12.90,
    rating: 4.8,
    reviewsCount: 120,
    image: '/images/prod_suporte_telemovel.png',
    colors: JANLEY_COLORS,
    description: 'Suporte minimalista canelado para telemóveis e tablets pequenos. Proporciona o ângulo perfeito de visualização na secretária com canal para passagem de cabo de carregamento.',
    dimensions: '8.5 x 8.0 x 7.2 cm',
    material: 'PLA Premium Biodegradável acabamento mate',
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'chaveiro-personalizado',
    name: 'Chaveiro Personalizado',
    category: 'Personalizados',
    categoryId: 'personalizados',
    price: 6.90,
    rating: 4.9,
    reviewsCount: 98,
    image: '/images/prod_chaveiro_personalizado.png',
    colors: JANLEY_COLORS,
    description: 'Chaveiro 3D elegante com inicial ou símbolo de coração, argola dourada metálica reforçada e acabamento suave ao toque.',
    dimensions: '4.5 x 4.0 x 0.5 cm',
    material: 'PLA de Alta Densidade e Argola de Aço Inox Dourada',
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'organizador-mesa',
    name: 'Organizador de Mesa',
    category: 'Organização',
    categoryId: 'organizacao',
    price: 14.90,
    rating: 4.8,
    reviewsCount: 110,
    image: '/images/prod_organizador_mesa.png',
    colors: JANLEY_COLORS,
    description: 'Conjunto duo canelado com acabamento estriado moderno. Perfeito para canetas, lápis, pincéis ou utensílios de escritório.',
    dimensions: '14.0 x 8.5 x 9.8 cm',
    material: 'PLA Bio de fabrico aditivo com parede reforçada',
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'vaso-decorativo',
    name: 'Vaso Decorativo',
    category: 'Decoração',
    categoryId: 'decoracao',
    price: 18.90,
    rating: 4.9,
    reviewsCount: 85,
    image: '/images/prod_vaso_decorativo.png',
    colors: VASO_COLORS,
    description: 'Vaso geométrico com linhas espirais esculpidas em impressão 3D precisa. Ideal para plantas secas, flores artificiais ou arranjos interiores sofisticados.',
    dimensions: '12.0 x 12.0 x 16.5 cm',
    material: 'PLA Ecológico Texturado com padrão espiral contínuo',
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'arvore-natal-espiral',
    name: 'Mini Árvore de Natal Origami',
    category: 'Coleção de Natal',
    categoryId: 'natal',
    price: 9.90,
    rating: 5.0,
    reviewsCount: 42,
    image: '/assets/aistudio/Natal_3D_com_Luzes_Aconchegantes_8827239d.png',
    colors: JANLEY_COLORS,
    description: 'Árvore decorativa de Natal com estética origami e estrela no topo. Uma peça mágica e acolhedora para centros de mesa natalícios.',
    dimensions: '10.0 x 10.0 x 15.0 cm',
    material: 'PLA de origem vegetal',
    isFeatured: false,
    isBestseller: false,
  },
  {
    id: 'suporte-comando-gaming',
    name: 'Suporte de Comando Gaming',
    category: 'Gaming',
    categoryId: 'gaming',
    price: 16.90,
    rating: 4.9,
    reviewsCount: 67,
    image: '/assets/aistudio/Suporte_Magenta_para_Controle_PlayStation_4046085c.png',
    colors: JANLEY_COLORS,
    description: 'Suporte ergonómico e estável compatível com comandos PS5, PS4, Xbox e Nintendo Switch Pro. Base antiderrapante incluída.',
    dimensions: '9.0 x 10.5 x 12.0 cm',
    material: 'PLA+ reforçado com elevada rigidez mecânica',
    isFeatured: false,
    isBestseller: true,
  },
  {
    id: 'letreiro-nome-personalizado',
    name: 'Letreiro com Nome & Coração',
    category: 'Personalizados',
    categoryId: 'personalizados',
    price: 15.90,
    rating: 5.0,
    reviewsCount: 134,
    image: '/images/cat_personalizados.png',
    colors: JANLEY_COLORS,
    description: 'Letreiro 3D personalizado com o teu nome ou palavra favorita numa caligrafia fluida, apoiado sobre uma base sólida com coração decorativo.',
    dimensions: '20.0 x 4.5 x 8.0 cm (varia consoante o nome)',
    material: 'PLA Premium em dupla camada',
    isFeatured: false,
    isBestseller: true,
  },
  {
    id: 'capa-telemovel-escultural',
    name: 'Capa Protetora com Relevo 3D',
    category: 'Capas de Telemóvel',
    categoryId: 'telemovel',
    price: 13.90,
    rating: 4.7,
    reviewsCount: 51,
    image: '/images/cat_telemovel.png',
    colors: JANLEY_COLORS,
    description: 'Capa esculpida com textura tátil geométrica que melhora a aderência na mão e protege contra impactos ligeiros.',
    dimensions: 'Adaptada ao modelo de smartphone selecionado',
    material: 'TPU flexível / PLA Híbrido com absorção de choques',
    isFeatured: false,
    isBestseller: false,
  },
];
