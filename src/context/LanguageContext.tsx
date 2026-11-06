import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  pt: {
    // TopBar & Header
    entrega_info: 'Entregas para todo Portugal',
    rastrear: 'Rastrear Encomenda',
    contacto: 'Contacto',
    inicio: 'Início',
    loja: 'Loja',
    categorias: 'Categorias',
    personalizados: 'Personalizados',
    orcamento: 'Orçamento',
    sobre: 'Sobre nós',
    favoritos: 'Favoritos',
    carrinho: 'Carrinho',
    adicionar: 'Adicionar',
    ver_detalhes: 'Ver Detalhes & Personalizar',
    enviar_orcamento: 'Enviar Orçamento',
    pesquisar: 'Pesquisar peças 3D...',

    // Hero Section
    hero_slide1_title1: 'Ideias que',
    hero_slide1_title2: 'ganham forma.',
    hero_slide1_subtitle: 'Produtos únicos, personalizados e feitos com tecnologia de impressão 3D. Peças exclusivas fabricadas em Guimarães, Portugal.',
    hero_slide2_title1: 'Design & arte',
    hero_slide2_title2: 'para o teu espaço.',
    hero_slide2_subtitle: 'Decoração moderna fabricada camada a camada com filamentos biodegradáveis e acabamento artesanal.',
    hero_btn_explore: 'VER PRODUTOS',
    hero_btn_custom: 'CRIAR PERSONALIZADO',

    // Value Proposition Bar (FeatureBar)
    feature_delivery_title: 'CTT • Uber • Recolha',
    feature_delivery_sub: 'Entregas em todo Portugal',
    feature_local_title: 'Guimarães, Braga 🇵🇹',
    feature_local_sub: 'Produção 3D artesanal local',
    feature_custom_title: 'Peças Sob Medida',
    feature_custom_sub: 'Cores, nomes & orçamentos',
    feature_payment_title: 'MB WAY',
    feature_payment_sub: 'Aceitamos apenas MB WAY',

    // Categories Section
    categories_badge: 'Atelier 3D Guimarães',
    categories_title: 'Comprar por Categoria',
    cat_natal: 'Natal',
    cat_chaveiros: 'Chaveiros',
    cat_gaming: 'Gaming',
    cat_personalizados: 'Personalizados',
    cat_decoracao: 'Decoração',
    cat_lazer: 'Lazer',
    cat_infantil: 'Infantil',
    cat_organizacao: 'Organização',
    cat_casa: 'Casa',
    cat_futebol: 'Futebol',
    cat_empresas: 'Empresas',
    cat_outros: 'Outros',

    // Featured Products Section
    featured_title: 'Produtos em Destaque',
    filter_by: 'A filtrar por categoria',
    clear_filter: 'Limpar filtro',
    color_label: 'Cor:',
    colors_count: 'cores',
    btn_customize: 'PERSONALIZAR',
    btn_view_options: 'VER OPÇÕES',

    // Direct Budget Section
    quote_badge: 'Atelier de Fabrico Aditivo 3D',
    quote_title: 'Pedir Orçamento Personalizado',
    quote_step1: '1. Categoria da Peça',
    quote_step2: '2. Imagem de Exemplo (Opcional)',
    quote_upload_hint: 'Clica ou arrasta uma foto da ideia',
    quote_step3: '3. Quantidade:',
    quote_step4: '4. Cor:',
    quote_step5: '5. Detalhes ou Medidas Desejadas',
    quote_step5_placeholder: "Ex: Letreiro com nome 'Lucas' em dourado, aprox. 15 cm...",
    quote_client_name: 'O teu Nome',
    quote_client_phone: 'Telemóvel (WhatsApp)',
    quote_summary_title: 'Resumo do Pedido 3D',
    quote_delivery_summary: 'Entrega:',
    quote_delivery_val: 'CTT, Uber ou Recolha',
    quote_whatsapp_opened: 'WhatsApp aberto com sucesso! Envia a mensagem com os detalhes.',

    // Customization Banner
    custom_banner_line1: 'Personaliza a tua ideia.',
    custom_banner_line2: 'Criamos peças únicas para ti.',
    custom_banner_desc: 'Diz-nos o que tens em mente e nós transformamos em realidade com impressão 3D no nosso atelier em Guimarães.',
    custom_banner_btn: 'PEDIR PERSONALIZAÇÃO',

    // Footer
    footer_referral_badge: 'Programa de Amigos Janley',
    footer_referral_sub: 'Recomenda & Partilha',
    footer_referral_title: 'Gostas das nossas peças 3D? Recomenda a Janley Store a um amigo!',
    footer_referral_desc: 'Surpreende alguém especial com decorações, chaveiros e presentes personalizados.',
    footer_referral_btn: 'Indicar a um Amigo via WhatsApp',
    footer_desc: 'Criatividade, precisão e design em cada detalhe. Peças exclusivas em impressão 3D fabricadas no nosso atelier com entregas para todo o território português.',
    footer_quick_links: 'Links Rápidos',
    footer_support_title: 'Apoio & Encomendas',
    footer_newsletter_title: 'Newsletter Janley',
    footer_newsletter_desc: 'Subscreve para receber descontos e novas coleções de filamento 3D.',
    footer_newsletter_btn: 'Subscrever',
    footer_newsletter_placeholder: 'O teu email',
    footer_delivery_bottom: 'ENVIAMOS POR CTT - UBER - RECOLHA',
    footer_payment_exclusive: 'Pagamento exclusivo:',
    footer_admin_link: '• Área Reservada (/admin)',

    // Floating Button
    floating_custom_title: 'Pedir Peça 3D',
    floating_custom_sub: 'Orçamento Sob Medida',
  },

  en: {
    // TopBar & Header
    entrega_info: 'Deliveries across Portugal',
    rastrear: 'Track Order',
    contacto: 'Contact',
    inicio: 'Home',
    loja: 'Shop',
    categorias: 'Categories',
    personalizados: 'Custom Orders',
    orcamento: 'Custom Quote',
    sobre: 'About Us',
    favoritos: 'Wishlist',
    carrinho: 'Cart',
    adicionar: 'Add to Cart',
    ver_detalhes: 'View Details & Customize',
    enviar_orcamento: 'Submit Quote Request',
    pesquisar: 'Search 3D creations...',

    // Hero Section
    hero_slide1_title1: 'Ideas that',
    hero_slide1_title2: 'take shape.',
    hero_slide1_subtitle: 'Unique, custom-made pieces created with 3D printing technology. Handcrafted in Guimarães, Portugal.',
    hero_slide2_title1: 'Design & art',
    hero_slide2_title2: 'for your space.',
    hero_slide2_subtitle: 'Modern decor crafted layer by layer with eco-friendly filaments and artisan precision.',
    hero_btn_explore: 'EXPLORE SHOP',
    hero_btn_custom: 'CUSTOM ORDER',

    // Value Proposition Bar (FeatureBar)
    feature_delivery_title: 'CTT • Uber • Studio Pickup',
    feature_delivery_sub: 'Shipping across all Portugal',
    feature_local_title: 'Guimarães, Portugal 🇵🇹',
    feature_local_sub: 'Local artisan 3D workshop',
    feature_custom_title: 'Made to Measure',
    feature_custom_sub: 'Custom colors, names & quotes',
    feature_payment_title: 'MB WAY',
    feature_payment_sub: 'We accept MB WAY exclusively',

    // Categories Section
    categories_badge: '3D Atelier Guimarães',
    categories_title: 'Shop by Category',
    cat_natal: 'Christmas',
    cat_chaveiros: 'Keychains',
    cat_gaming: 'Gaming',
    cat_personalizados: 'Custom Orders',
    cat_decoracao: 'Decor',
    cat_lazer: 'Leisure',
    cat_infantil: 'Kids',
    cat_organizacao: 'Organization',
    cat_casa: 'Home',
    cat_futebol: 'Football',
    cat_empresas: 'Corporate',
    cat_outros: 'Others',

    // Featured Products Section
    featured_title: 'Featured Products',
    filter_by: 'Filtering by category',
    clear_filter: 'Clear filter',
    color_label: 'Color:',
    colors_count: 'colors',
    btn_customize: 'CUSTOMIZE',
    btn_view_options: 'VIEW OPTIONS',

    // Direct Budget Section
    quote_badge: '3D Additive Manufacturing Atelier',
    quote_title: 'Request a Custom 3D Quote',
    quote_step1: '1. Piece Category',
    quote_step2: '2. Reference Photo (Optional)',
    quote_upload_hint: 'Click or drop a photo of your idea',
    quote_step3: '3. Quantity:',
    quote_step4: '4. Color:',
    quote_step5: '5. Custom Details or Dimensions',
    quote_step5_placeholder: "E.g. Nameplate 'Lucas' in gold finish, approx. 15 cm...",
    quote_client_name: 'Your Name',
    quote_client_phone: 'Phone Number (WhatsApp)',
    quote_summary_title: '3D Order Summary',
    quote_delivery_summary: 'Delivery:',
    quote_delivery_val: 'CTT, Uber or Studio Pickup',
    quote_whatsapp_opened: 'WhatsApp opened! Please review and send your message.',

    // Customization Banner
    custom_banner_line1: 'Customize your idea.',
    custom_banner_line2: 'We craft unique pieces for you.',
    custom_banner_desc: 'Tell us your vision and we bring it to reality with high-precision 3D printing at our Guimarães atelier.',
    custom_banner_btn: 'REQUEST CUSTOM PIECE',

    // Footer
    footer_referral_badge: 'Janley Friends Program',
    footer_referral_sub: 'Recommend & Share',
    footer_referral_title: 'Love our 3D creations? Recommend Janley Store to a friend!',
    footer_referral_desc: 'Surprise someone special with personalized decor, keychains and unique gifts.',
    footer_referral_btn: 'Refer a Friend via WhatsApp',
    footer_desc: 'Creativity, precision and design in every detail. Exclusive 3D printed creations handcrafted in Guimarães with shipping across Portugal.',
    footer_quick_links: 'Quick Links',
    footer_support_title: 'Support & Orders',
    footer_newsletter_title: 'Janley Newsletter',
    footer_newsletter_desc: 'Subscribe to receive discounts and new 3D filament collections.',
    footer_newsletter_btn: 'Subscribe',
    footer_newsletter_placeholder: 'Your email address',
    footer_delivery_bottom: 'SHIPPING VIA CTT - UBER - PICKUP',
    footer_payment_exclusive: 'Exclusive payment:',
    footer_admin_link: '• Admin Portal (/admin)',

    // Floating Button
    floating_custom_title: 'Custom 3D Order',
    floating_custom_sub: 'Made to Measure',
  },

  es: {
    // TopBar & Header
    entrega_info: 'Envíos a todo Portugal',
    rastrear: 'Rastrear Pedido',
    contacto: 'Contacto',
    inicio: 'Inicio',
    loja: 'Tienda',
    categorias: 'Categorías',
    personalizados: 'Personalizados',
    orcamento: 'Presupuesto',
    sobre: 'Sobre nosotros',
    favoritos: 'Favoritos',
    carrinho: 'Carrito',
    adicionar: 'Añadir',
    ver_detalhes: 'Ver Detalles y Personalizar',
    enviar_orcamento: 'Enviar Presupuesto',
    pesquisar: 'Buscar creaciones 3D...',

    // Hero Section
    hero_slide1_title1: 'Ideas que',
    hero_slide1_title2: 'toman forma.',
    hero_slide1_subtitle: 'Productos únicos y personalizados con tecnología de impresión 3D. Piezas exclusivas fabricadas en Guimarães, Portugal.',
    hero_slide2_title1: 'Diseño y arte',
    hero_slide2_title2: 'para tu espacio.',
    hero_slide2_subtitle: 'Decoración moderna fabricada capa a capa con filamentos ecológicos y acabado artesanal.',
    hero_btn_explore: 'VER PRODUCTOS',
    hero_btn_custom: 'CREAR PERSONALIZADO',

    // Value Proposition Bar (FeatureBar)
    feature_delivery_title: 'CTT • Uber • Recogida',
    feature_delivery_sub: 'Envíos a todo Portugal',
    feature_local_title: 'Guimarães, Portugal 🇵🇹',
    feature_local_sub: 'Producción 3D artesanal local',
    feature_custom_title: 'Piezas a Medida',
    feature_custom_sub: 'Colores, nombres y presupuestos',
    feature_payment_title: 'MB WAY',
    feature_payment_sub: 'Aceptamos exclusivamente MB WAY',

    // Categories Section
    categories_badge: 'Taller 3D Guimarães',
    categories_title: 'Comprar por Categoría',
    cat_natal: 'Navidad',
    cat_chaveiros: 'Llaveros',
    cat_gaming: 'Gaming',
    cat_personalizados: 'Personalizados',
    cat_decoracao: 'Decoración',
    cat_lazer: 'Ocio',
    cat_infantil: 'Infantil',
    cat_organizacao: 'Organización',
    cat_casa: 'Hogar',
    cat_futebol: 'Fútbol',
    cat_empresas: 'Empresas',
    cat_outros: 'Otros',

    // Featured Products Section
    featured_title: 'Productos Destacados',
    filter_by: 'Filtrando por categoría',
    clear_filter: 'Limpiar filtro',
    color_label: 'Color:',
    colors_count: 'colores',
    btn_customize: 'PERSONALIZAR',
    btn_view_options: 'VER OPCIONES',

    // Direct Budget Section
    quote_badge: 'Taller de Fabricación Aditiva 3D',
    quote_title: 'Pedir Presupuesto Personalizado',
    quote_step1: '1. Categoría de la Pieza',
    quote_step2: '2. Foto de Referencia (Opcional)',
    quote_upload_hint: 'Haz clic o arrastra una foto de la idea',
    quote_step3: '3. Cantidad:',
    quote_step4: '4. Color:',
    quote_step5: '5. Detalles o Medidas Deseadas',
    quote_step5_placeholder: "Ej: Letrero con nombre 'Lucas' en dorado, aprox. 15 cm...",
    quote_client_name: 'Tu Nombre',
    quote_client_phone: 'Teléfono (WhatsApp)',
    quote_summary_title: 'Resumen del Pedido 3D',
    quote_delivery_summary: 'Entrega:',
    quote_delivery_val: 'CTT, Uber o Recogida',
    quote_whatsapp_opened: '¡WhatsApp abierto con éxito! Envía el mensaje con los detalles.',

    // Customization Banner
    custom_banner_line1: 'Personaliza tu idea.',
    custom_banner_line2: 'Creamos piezas únicas para ti.',
    custom_banner_desc: 'Dinos qué tienes en mente y lo transformamos en realidad con impresión 3D en nuestro taller de Guimarães.',
    custom_banner_btn: 'PEDIR PERSONALIZACIÓN',

    // Footer
    footer_referral_badge: 'Programa de Amigos Janley',
    footer_referral_sub: 'Recomienda y Comparte',
    footer_referral_title: '¿Te gustan nuestras piezas 3D? ¡Recomienda Janley Store a un amigo!',
    footer_referral_desc: 'Sorprende a alguien especial con decoración, llaveros y regalos personalizados.',
    footer_referral_btn: 'Recomendar a un Amigo por WhatsApp',
    footer_desc: 'Creatividad, precisión y diseño en cada detalhe. Piezas exclusivas de impresión 3D fabricadas en nuestro taller con envíos a todo Portugal.',
    footer_quick_links: 'Enlaces Rápidos',
    footer_support_title: 'Soporte y Pedidos',
    footer_newsletter_title: 'Boletín Janley',
    footer_newsletter_desc: 'Suscríbete para recibir descuentos y nuevas colecciones de filamento 3D.',
    footer_newsletter_btn: 'Suscribirse',
    footer_newsletter_placeholder: 'Tu correo electrónico',
    footer_delivery_bottom: 'ENVIAMOS POR CTT - UBER - RECOGIDA',
    footer_payment_exclusive: 'Pago exclusivo:',
    footer_admin_link: '• Área Reservada (/admin)',

    // Floating Button
    floating_custom_title: 'Pedir Pieza 3D',
    floating_custom_sub: 'Presupuesto a Medida',
  },

  fr: {
    // TopBar & Header
    entrega_info: 'Livraisons dans tout le Portugal',
    rastrear: 'Suivre la Commande',
    contacto: 'Contact',
    inicio: 'Accueil',
    loja: 'Boutique',
    categorias: 'Catégories',
    personalizados: 'Sur Mesure',
    orcamento: 'Devis',
    sobre: 'À Propos',
    favoritos: 'Favoris',
    carrinho: 'Panier',
    adicionar: 'Ajouter',
    ver_detalhes: 'Voir Détails & Personnaliser',
    enviar_orcamento: 'Envoyer le Devis',
    pesquisar: 'Rechercher des créations 3D...',

    // Hero Section
    hero_slide1_title1: 'Des idées qui',
    hero_slide1_title2: 'prennent forme.',
    hero_slide1_subtitle: 'Créations uniques et personnalisées réalisées avec la technologie d\'impression 3D à Guimarães, Portugal.',
    hero_slide2_title1: 'Design & art',
    hero_slide2_title2: 'pour votre espace.',
    hero_slide2_subtitle: 'Décoration moderne fabriquée couche par couche avec des filaments écologiques et finition soignée.',
    hero_btn_explore: 'VOIR LA BOUTIQUE',
    hero_btn_custom: 'SUR MESURE',

    // Value Proposition Bar (FeatureBar)
    feature_delivery_title: 'CTT • Uber • Retrait',
    feature_delivery_sub: 'Livraison dans tout le Portugal',
    feature_local_title: 'Guimarães, Portugal 🇵🇹',
    feature_local_sub: 'Atelier artisanal 3D local',
    feature_custom_title: 'Pièces Sur Mesure',
    feature_custom_sub: 'Couleurs, noms & devis',
    feature_payment_title: 'MB WAY',
    feature_payment_sub: 'Paiement exclusif par MB WAY',

    // Categories Section
    categories_badge: 'Atelier 3D Guimarães',
    categories_title: 'Acheter par Catégorie',
    cat_natal: 'Noël',
    cat_chaveiros: 'Porte-clés',
    cat_gaming: 'Gaming',
    cat_personalizados: 'Sur Mesure',
    cat_decoracao: 'Décoration',
    cat_lazer: 'Loisirs',
    cat_infantil: 'Enfants',
    cat_organizacao: 'Rangement',
    cat_casa: 'Maison',
    cat_futebol: 'Football',
    cat_empresas: 'Entreprises',
    cat_outros: 'Autres',

    // Featured Products Section
    featured_title: 'Produits en Vedette',
    filter_by: 'Filtré par catégorie',
    clear_filter: 'Effacer le filtre',
    color_label: 'Couleur :',
    colors_count: 'couleurs',
    btn_customize: 'PERSONNALISER',
    btn_view_options: 'VOIR OPTIONS',

    // Direct Budget Section
    quote_badge: 'Atelier de Fabrication Additive 3D',
    quote_title: 'Demander un Devis Sur Mesure',
    quote_step1: '1. Catégorie de la Pièce',
    quote_step2: '2. Photo de Référence (Facultatif)',
    quote_upload_hint: 'Cliquez ou déposez une photo de votre idée',
    quote_step3: '3. Quantité :',
    quote_step4: '4. Couleur :',
    quote_step5: '5. Détails ou Dimensions Souhaitées',
    quote_step5_placeholder: "Ex : Plaque avec nom 'Lucas' en or, env. 15 cm...",
    quote_client_name: 'Votre Nom',
    quote_client_phone: 'Téléphone (WhatsApp)',
    quote_summary_title: 'Résumé du Devis 3D',
    quote_delivery_summary: 'Livraison :',
    quote_delivery_val: 'CTT, Uber ou Retrait',
    quote_whatsapp_opened: 'WhatsApp ouvert avec succès ! Envoyez votre message.',

    // Customization Banner
    custom_banner_line1: 'Personnalisez votre idée.',
    custom_banner_line2: 'Nous créons des pièces uniques pour vous.',
    custom_banner_desc: 'Dites-nous ce que vous imaginez et nous le réalisons avec l\'impression 3D dans notre atelier à Guimarães.',
    custom_banner_btn: 'DEMANDER DU SUR-MESURE',

    // Footer
    footer_referral_badge: 'Programme d\'Amis Janley',
    footer_referral_sub: 'Recommander & Partager',
    footer_referral_title: 'Vous aimez nos créations 3D ? Recommandez Janley Store à un ami !',
    footer_referral_desc: 'Surprenez un proche avec des décors, porte-clés et cadeaux personnalisés.',
    footer_referral_btn: 'Recommander à un Ami via WhatsApp',
    footer_desc: 'Créativité, précision et design dans chaque détail. Créations exclusives en impression 3D avec livraisons dans tout le Portugal.',
    footer_quick_links: 'Liens Rapides',
    footer_support_title: 'Support & Commandes',
    footer_newsletter_title: 'Newsletter Janley',
    footer_newsletter_desc: 'Abonnez-vous pour recevoir des remises et les nouveautés.',
    footer_newsletter_btn: 'S\'abonner',
    footer_newsletter_placeholder: 'Votre adresse e-mail',
    footer_delivery_bottom: 'EXPÉDITION PAR CTT - UBER - RETRAIT',
    footer_payment_exclusive: 'Paiement exclusif :',
    footer_admin_link: '• Espace Réservé (/admin)',

    // Floating Button
    floating_custom_title: 'Création 3D Sur Mesure',
    floating_custom_sub: 'Devis Personnalisé',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('janley_lang') as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('janley_lang', lang);
  };

  const t = (key: string): string => {
    const val = TRANSLATIONS[language]?.[key] || TRANSLATIONS.pt[key];
    if (val) return val;
    if (key.startsWith('cat_')) {
      return key.replace('cat_', '');
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
