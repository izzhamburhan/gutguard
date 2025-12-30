
import React, { useState, useMemo } from 'react';
import { 
  Leaf, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Utensils, 
  Droplets, 
  Zap, 
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Search,
  Home,
  Ban, 
  Clock,
  Sparkles,
  Menu as MenuIcon,
  X,
  Calendar as CalendarIcon,
  Coffee,
  Sun,
  Moon,
  ArrowDownCircle,
  ShoppingCart,
  ChefHat,
  Flame,
  Timer,
  BookOpen,
  ShoppingBag,
  PackageCheck,
  ShoppingBasket
} from 'lucide-react';
import { getGutHealthAdvice } from './services/geminiService';
import { FoodItem, MealPlan, Recipe } from './types';

type View = 'home' | 'diet' | 'pantang' | 'regimen' | 'tips' | 'calendar' | 'recipes';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRegimenTab, setActiveRegimenTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>('ayam-kicap');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const atHome = ['Ayam', 'Telur', 'Bawang Putih', 'Bawang Merah', 'Sos Cili', 'Sos Tomato', 'Sos Tiram', 'Kicap Manis', 'Kicap Masin', 'Nasi', 'Anggur Hijau', 'Air'];
  const buyList = [
    { name: 'Halia Tua', qty: '4-5 Inci' },
    { name: 'Serai Segar', qty: '5 Batang' },
    { name: 'Ikan Merah / Jenahak', qty: '2 Potong' },
    { name: 'Ikan Selar / Kembung', qty: '4-5 Ekor' },
    { name: 'Ikan Siakap', qty: '1 Ekor Sederhana' },
    { name: 'Asam Keping', qty: '1 Paket' },
    { name: 'Sawi / Bayam', qty: '2 Ikat' },
    { name: 'Labu Manis', qty: '300g' },
    { name: 'Kunyit Hidup', qty: '2 Inci' },
    { name: 'Garam Bukit', qty: '1 Paket' },
    { name: 'Buah (Betik/Naga)', qty: '1 Biji' }
  ];

  const recipes: Recipe[] = [
    {
      id: 'ayam-kicap',
      title: 'Ayam Masak Kicap Gut-Safe',
      category: 'Utama',
      ingredients: [
        '300g Ayam (Potong kecil)',
        '3 Sdm Kicap Manis',
        '1 Sdm Sos Tiram',
        '1 Sdm Kicap Masin',
        '2 Inci Halia (Hiris halus)',
        '1/2 Cawan Air'
      ],
      steps: [
        'Hidupkan kuali elektrik pada suhu sederhana.',
        'Tumis hiris halia (pengganti bawang) tanpa minyak atau minyak sikit sehingga naik bau.',
        'Masukkan ketulan ayam. Biarkan ayam kecut dan sedikit keperangan.',
        'Masukkan kicap manis, kicap masin, dan sos tiram. Gaul rata.',
        'Tuangkan air. Biarkan kuah mendidih dan ayam masak sempurna.',
        'Kacau sehingga kuah memekat dan menyaluti ayam.'
      ],
      tips: 'Guna fungsi non-stick kuali elektrik anda sepenuhnya. Masakan ini lebih sihat tanpa minyak gorengan dalam.'
    },
    {
      id: 'sup-ikan-merah',
      title: 'Sup Ikan Merah Bening',
      category: 'Utama',
      ingredients: [
        '1 Potong Ikan Merah (200g)',
        '2 Inci Halia (Ketuk)',
        '1 Batang Serai (Ketuk)',
        '500ml Air',
        '1 Sdt Garam Bukit'
      ],
      steps: [
        'Isi kuali elektrik dengan air, halia, dan serai.',
        'Set suhu tinggi sehingga mendidih.',
        'Masukkan ikan merah. Kecilkan suhu ke sederhana.',
        'Masak selama 5 minit sehingga isi ikan putih dan pejal.',
        'Perasakan dengan garam bukit sebelum tutup suis.'
      ],
      tips: 'Zero Oil! Ikan merah kaya dengan protein mudah hadam dan sup halia membantu buang angin.'
    },
    {
      id: 'siakap-bakar',
      title: 'Ikan Siakap Bakar Gut-Safe',
      category: 'Utama',
      ingredients: [
        '1 Ekor Ikan Siakap (Sederhana)',
        '1 Inci Kunyit Hidup (Tumbuk)',
        '1 Inci Halia (Tumbuk)',
        '1 Batang Serai (Ketuk)',
        'Secubit Garam Bukit'
      ],
      steps: [
        'Bersihkan ikan siakap dan kelar badannya.',
        'Lumur dengan kunyit, halia, dan garam.',
        'Panaskan kuali elektrik pada suhu sederhana (Tanpa Minyak).',
        'Letak ikan, masukkan serai dalam perut ikan.',
        'Tutup kuali elektrik. Panggang 8-10 minit setiap belah sehingga garing.'
      ],
      tips: 'Tanpa Minyak. Menutup kuali elektrik membantu ikan masak sekata menggunakan wap semulajadi ikan.'
    },
    {
      id: 'jenahak-grill',
      title: 'Ikan Jenahak Grill Kunyit',
      category: 'Utama',
      ingredients: [
        '1 Potong Ikan Jenahak',
        '1 Sdt Kunyit Hidup (Tumbuk)',
        '1 Inci Halia (Tumbuk)',
        'Secubit Garam Bukit'
      ],
      steps: [
        'Lumur ikan jenahak dengan kunyit, halia, dan garam.',
        'Panaskan kuali elektrik suhu sederhana (Non-stick mode).',
        'Letak ikan (Tanpa Minyak). Tutup kuali supaya isi dalam masak dengan wap panas.',
        'Balikkan perlahan-lahan selepas 6 minit sehingga kedua-dua belah garing.'
      ],
      tips: 'Tanpa Minyak. Kunyit adalah anti-radang semulajadi yang sangat baik untuk usus.'
    },
    {
      id: 'asam-rebus-selar',
      title: 'Ikan Selar Asam Rebus',
      category: 'Utama',
      ingredients: [
        '2 Ekor Ikan Selar',
        '2 Keping Asam Keping',
        '1 Inci Kunyit Hidup (Hiris)',
        '1 Inci Halia (Hiris)',
        '1 Batang Serai (Ketuk)',
        '400ml Air',
        '1 Sdt Garam'
      ],
      steps: [
        'Masukkan air, kunyit, halia, serai, dan asam keping ke dalam kuali elektrik.',
        'Didihkan dengan suhu tinggi.',
        'Masukkan ikan selar. Masak sehingga kuah meresap ke dalam ikan.',
        'Perasakan dengan garam. Menu ini tidak menggunakan minyak langsung.'
      ],
      tips: 'Zero Oil. Rasa masam dari asam keping membantu meningkatkan selera tanpa pedas.'
    },
    {
      id: 'chicken-grill',
      title: 'Chicken Grill Herbs',
      category: 'Utama',
      ingredients: [
        '1 Ketul Dada Ayam (Kelar nipis)',
        '1 Sdm Sos Tiram',
        '1 Inci Halia (Hiris halus)',
        'Secubit Garam Bukit'
      ],
      steps: [
        'Perap dada ayam dengan sos tiram, halia, dan garam selama 15 minit.',
        'Panaskan kuali elektrik pada suhu sederhana.',
        'Grill ayam (Tanpa Minyak). Tutup kuali.',
        'Masak 5-7 minit setiap belah sehingga garing di luar tapi juicy di dalam.'
      ],
      tips: 'Tanpa Minyak. Dada ayam adalah protein paling bersih untuk pengamal FODMAP.'
    },
    {
      id: 'telur-rebus',
      title: 'Telur Rebus Gut-Safe',
      category: 'Sarapan',
      ingredients: [
        '2 Biji Telur',
        'Air secukupnya'
      ],
      steps: [
        'Masukkan telur ke dalam kuali elektrik.',
        'Isi air sehingga telur tenggelam.',
        'Rebus selama 8-10 minit (Hard boiled).',
        'Rendam air sejuk sekejap sebelum dikupas.'
      ],
      tips: 'Zero Oil. Protein yang paling mudah dan selamat untuk memulakan hari anda.'
    },
    {
      id: 'omelet-sawi',
      title: 'Omelet Sawi Non-Stick',
      category: 'Sarapan',
      ingredients: [
        '2 Biji Telur',
        '1 Genggam Sawi (Hiris halus)',
        '1 Sdt Kicap Masin'
      ],
      steps: [
        'Pukul telur bersama kicap masin dan sawi.',
        'Guna suhu rendah kuali elektrik (Tanpa Minyak).',
        'Tuang adunan, biar masak rata.',
        'Lipat dua bila bahagian bawah sudah stabil.',
        'Angkat segera supaya telur tetap lembut.'
      ],
      tips: 'Tanpa Minyak. Fungsi non-stick kuali elektrik anda membolehkan telur masak sempurna tanpa melekat.'
    },
    {
      id: 'telur-mata',
      title: 'Telur Mata Non-Stick',
      category: 'Sarapan',
      ingredients: [
        '1 Biji Telur',
        'Secubit Garam'
      ],
      steps: [
        'Panaskan kuali elektrik pada suhu rendah.',
        'Pecahkan telur (Tanpa Minyak).',
        'Tutup kuali seketika jika ingin telur masak di atas (over easy).',
        'Angkat perlahan-lahan menggunakan sudip kayu/silikon.'
      ],
      tips: 'Tanpa Minyak. Sesuai dimakan bersama nasi putih hangat.'
    },
    {
      id: 'sup-telur',
      title: 'Sup Telur Halia',
      category: 'Utama',
      ingredients: [
        '2 Biji Telur',
        '1 Inci Halia (Hiris halus)',
        '300ml Air',
        '1/2 Sdt Garam'
      ],
      steps: [
        'Didihkan air bersama halia dalam kuali elektrik.',
        'Pecahkan telur satu persatu ke dalam air mendidih (Jangan kacau kuat).',
        'Biar telur mengeras sikit.',
        'Perasakan dengan garam dan angkat.'
      ],
      tips: 'Zero Oil. Menu yang sangat menyelesakan bila perut rasa tidak enak.'
    },
    {
      id: 'sup-sayur-campur',
      title: 'Sup Sayur Campur Halia',
      category: 'Sayur',
      ingredients: [
        '1 Mangkuk Sawi/Bayam',
        '50g Labu Manis (Potong dadu)',
        '1 Inci Halia (Hiris)',
        '300ml Air',
        'Secubit Garam'
      ],
      steps: [
        'Rebus labu manis bersama halia sehingga labu lembut.',
        'Masukkan air jika perlu. Biar mendidih.',
        'Masukkan sayur hijau. Biarkan 1 minit sahaja.',
        'Tutup suis kuali elektrik segera untuk elak sayur lembek.'
      ],
      tips: 'Zero Oil. Labu manis memberikan tekstur "creamy" pada sup sayur bening.'
    },
    {
      id: 'telur-kicap-halia',
      title: 'Telur Kicap Halia',
      category: 'Sarapan',
      ingredients: [
        '2 Biji Telur',
        '2 Sdm Kicap Manis',
        '1/2 Sdm Kicap Masin',
        '1 Inci Halia (Hiris mancis)',
        '1 Sdm Air'
      ],
      steps: [
        'Goreng telur mata menggunakan kuali elektrik suhu rendah (Tanpa Minyak).',
        'Angkat telur. Dalam kuali yang sama, masukkan sedikit air dan kicap.',
        'Masukkan halia, masak sehingga halia layu dan kuah mendidih.',
        'Curahkan kuah kicap halia di atas telur tadi.'
      ],
      tips: 'Tanpa Minyak. Menu paling ekspres menggunakan bahan sedia ada di dapur anda.'
    },
    {
      id: 'ikan-singgang',
      title: 'Singgang Ikan Kembung',
      category: 'Utama',
      ingredients: [
        '2 Ekor Ikan Kembung',
        '2 Inci Halia (Hiris)',
        '1 Batang Serai (Ketuk)',
        '1 Keping Asam Keping',
        '500ml Air',
        '1 Sdt Garam'
      ],
      steps: [
        'Masukkan air, halia, serai, and asam keping ke dalam kuali elektrik.',
        'Set suhu tinggi sehingga air mendidih.',
        'Masukkan ikan kembung. Kecilkan suhu sedikit.',
        'Masak sehingga ikan masak sepenuhnya (mata ikan jadi putih).',
        'Tambah garam dan tutup suis.'
      ],
      tips: 'Zero Oil. Kuah singgang sangat bagus untuk diminum bagi melegakan angin dalam perut.'
    },
    {
      id: 'ayam-bakar',
      title: 'Ayam Bakar Kuali',
      category: 'Utama',
      ingredients: [
        '2 Ketul Ayam (Thigh/Breast)',
        '2 Sdm Kicap Manis',
        '1 Sdm Sos Tiram',
        '2 Inci Halia (Ketuk)',
        'Secubit Garam'
      ],
      steps: [
        'Perap ayam dengan semua bahan selama 20 minit.',
        'Panaskan kuali elektrik suhu sederhana (Medium).',
        'Panggang ayam dalam kuali (Tanpa Minyak). Tutup kuali supaya ayam masak sekata.',
        'Terbalikkan bila nampak keperangan. Masak sehingga garing.'
      ],
      tips: 'Tanpa Minyak. Gunakan penutup kuali elektrik untuk mengekalkan kelembapan ayam.'
    },
    {
      id: 'bubur-nasi',
      title: 'Bubur Nasi Halia',
      category: 'Sarapan',
      ingredients: [
        '1 Mangkuk Nasi Putih',
        '3-4 Mangkuk Air',
        '1 Inci Halia (Hiris halus)',
        '1/2 Sdt Garam'
      ],
      steps: [
        'Masukkan nasi and air ke dalam kuali elektrik.',
        'Masak dengan suhu sederhana-tinggi.',
        'Kacau selalu supaya nasi hancur. Masukkan halia.',
        'Masak sehingga menjadi bubur pekat. Tambah garam di akhir.'
      ],
      tips: 'Zero Oil. Menu yang sangat lembut untuk dinding usus yang sensitif.'
    },
    {
      id: 'sayur-bening',
      title: 'Sayur Masak Bening',
      category: 'Sayur',
      ingredients: [
        '1 Ikat Sawi / Bayam',
        '50g Labu Manis',
        '1 Inci Halia (Hiris)',
        '400ml Air',
        '1/2 Sdt Garam'
      ],
      steps: [
        'Rebus labu manis bersama air and halia sehingga labu empuk.',
        'Masukkan sayur hijau.',
        'Tutup suis segera apabila sayur layu untuk elak terlebih masak.',
        'Perasakan dengan garam.'
      ],
      tips: 'Zero Oil. Sayur bening memberikan hidrasi dan serat yang mudah hadam.'
    }
  ];

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);
    const botResponse = await getGutHealthAdvice(userMsg);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse || 'Maaf, ralat berlaku.' }]);
    setIsChatLoading(false);
  };

  const navigate = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mealSchedule: MealPlan[] = [
    { day: 'Isnin', breakfast: 'Bubur Nasi + Telur Rebus', lunch: 'Nasi Putih + Ikan Singgang + Sawi Jepun', dinner: 'Ayam Bakar + Nasi + Betik', snack: 'Pisang Berangan' },
    { day: 'Selasa', breakfast: 'Telur Mata (Non-stick) + Betik', lunch: 'Nasi Basmathi + Sup Ikan Merah + Labu', dinner: 'Chicken Grill + Sayur Bening', snack: 'Kiwi Manis' },
    { day: 'Rabu', breakfast: 'Nasi Putih (Small) + Telur Hancur', lunch: 'Ikan Siakap Bakar + Nasi + Sawi Bunga', dinner: 'Sup Ayam + Nasi + Buah Naga', snack: 'Strawberry' },
    { day: 'Khamis', breakfast: 'Telur Rebus 2 Biji + Pisang', lunch: 'Nasi Wangi + Ikan Jenahak Grill + Labu Rebus', dinner: 'Omelet Sayur + Nasi + Anggur', snack: 'Blueberry' },
    { day: 'Jumaat', breakfast: 'Bubur Nasi Ayam (No Onion)', lunch: 'Nasi Putih + Ikan Selar Asam Rebus + Bayam', dinner: 'Ikan Kembung Bakar + Sayur Campur', snack: 'Betik Manis' },
    { day: 'Sabtu', breakfast: 'Scrambled Eggs + Buah Naga', lunch: 'Nasi Basmathi + Chicken Grill + Sawi', dinner: 'Sup Ikan + Nasi + Kiwi', snack: 'Pisang' },
    { day: 'Ahad', breakfast: 'Telur Mata + Nasi Putih Sedikit', lunch: 'Ikan Bakar Cicah Air Asam (No Chili) + Nasi', dinner: 'Ayam Panggang + Sayur Bening', snack: 'Anggur Merah' }
  ];

  const RecipesView = () => {
    const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

    const isAtHome = (ingredientStr: string) => {
      const lower = ingredientStr.toLowerCase();
      return atHome.some(item => lower.includes(item.toLowerCase()));
    };

    return (
      <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Portal Memasak GutGuard</h2>
          <p className="text-slate-500 font-medium italic">Guna Electric Kuali & optimumkan bahan yang sedia ada.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Column 1: Inventory & Shopping */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Flame className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Zap className="text-orange-500 w-5 h-5" /> Peralatan Saya
              </h3>
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Kitchen Power</p>
                <p className="text-xl font-bold">Electric Kuali</p>
                <p className="text-xs text-slate-400 mt-2">Fokus: <b>Zero/Tanpa Minyak</b>. Gunakan permukaan non-stick & penutup untuk kesan bakar yang sihat.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] shadow-sm">
              <h3 className="text-lg font-black text-amber-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="text-amber-600 w-5 h-5" /> Perlu Beli (Essentials)
              </h3>
              <ul className="space-y-4">
                {buyList.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      <span className="text-xs font-bold text-amber-800">{item.name}</span>
                    </div>
                    <span className="text-[10px] bg-white border border-amber-200 px-2 py-1 rounded-lg text-amber-600 font-black">
                      {item.qty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Recipe Menu List */}
          <div className="lg:col-span-3 space-y-3 max-h-[850px] overflow-y-auto pr-2 scrollbar-hide">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Senarai Resipi</h3>
            {recipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`w-full text-left p-5 rounded-[28px] transition-all border flex items-center gap-4 group ${
                  selectedRecipeId === recipe.id 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  selectedRecipeId === recipe.id ? 'bg-white/20' : 'bg-slate-50'
                }`}>
                  {recipe.category === 'Sarapan' ? <Coffee className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                    selectedRecipeId === recipe.id ? 'text-white/70' : 'text-slate-400'
                  }`}>
                    {recipe.category}
                  </p>
                  <h4 className="font-bold text-sm leading-tight">{recipe.title}</h4>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${selectedRecipeId === recipe.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Column 3: Detailed Cooking Steps */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-50 relative overflow-hidden min-h-[600px]">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ChefHat className="w-48 h-48" />
               </div>

               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Memasak Tanpa Minyak</div>
                   <div className="text-slate-400 text-xs font-bold flex items-center gap-2"><Timer className="w-4 h-4" /> 10-25 min</div>
                 </div>

                 <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{selectedRecipe.title}</h3>
                 
                 <div className="grid md:grid-cols-2 gap-10 mb-10">
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2">
                       <ShoppingCart className="w-3 h-3" /> Sukatan Bahan
                     </h4>
                     <div className="space-y-4">
                       <div>
                         <p className="text-[10px] font-black text-emerald-600 uppercase mb-3 flex items-center gap-1">
                           <PackageCheck className="w-3 h-3"/> Di Rumah (In Stock)
                         </p>
                         <ul className="space-y-2">
                           {selectedRecipe.ingredients.filter(isAtHome).map((ing, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm font-bold text-slate-700">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> {ing}
                             </li>
                           ))}
                         </ul>
                       </div>
                       
                       {selectedRecipe.ingredients.some(i => !isAtHome(i)) && (
                         <div>
                           <p className="text-[10px] font-black text-amber-600 uppercase mb-3 flex items-center gap-1">
                             <ShoppingBasket className="w-3 h-3"/> Perlu Beli (Need to Buy)
                           </p>
                           <ul className="space-y-2">
                             {selectedRecipe.ingredients.filter(ing => !isAtHome(ing)).map((ing, i) => (
                               <li key={i} className="flex items-start gap-2 text-sm font-bold text-slate-500 italic">
                                 <ShoppingCart className="w-4 h-4 text-amber-400 mt-0.5" /> {ing}
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 h-fit">
                     <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Zap className="w-4 h-4" /> Gut-Safe Tip
                     </h4>
                     <p className="text-xs text-indigo-800 leading-relaxed font-bold italic">"{selectedRecipe.tips}"</p>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <h4 className="text-xl font-black text-slate-900 border-b pb-4">Langkah Memasak (Electric Kuali)</h4>
                   <div className="grid gap-4">
                     {selectedRecipe.steps.map((step, i) => (
                       <div key={i} className="flex gap-5 items-start bg-slate-50 p-5 rounded-3xl border border-slate-100 group hover:bg-white hover:border-emerald-200 transition-all">
                         <div className="bg-slate-900 text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-lg">
                           {i + 1}
                         </div>
                         <p className="text-sm text-slate-600 font-bold leading-relaxed pt-1">{step}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const HomeView = () => (
    <div className="animate-in fade-in duration-1000">
      <header className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-xs font-bold mb-8 shadow-sm border border-emerald-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
          DASHBOARD PEMULIHAN USUS 2025
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
          Healthier Gut, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600">
            Happier Life.
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Panduan lengkap diet Low FODMAP & Probiotik untuk warga Malaysia yang ingin bebas dari kembung dan angin.
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 max-w-7xl mx-auto mb-16">
          {[
            { id: 'diet', label: 'Diet List', icon: <Utensils />, color: 'bg-emerald-600' },
            { id: 'calendar', label: 'Jadual Makan', icon: <CalendarIcon />, color: 'bg-blue-600' },
            { id: 'recipes', label: 'Resipi Masak', icon: <ChefHat />, color: 'bg-orange-500' },
            { id: 'regimen', label: 'Protokol', icon: <Clock />, color: 'bg-indigo-600' },
            { id: 'tips', label: 'Tips Ritual', icon: <Sparkles />, color: 'bg-amber-500' },
            { id: 'pantang', label: 'Zon Merah', icon: <Ban />, color: 'bg-red-500' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id as View)}
              className="flex flex-col items-center gap-4 p-6 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className={`${item.color} text-white p-4 rounded-[20px] group-hover:rotate-6 transition-transform shadow-lg`}>
                {item.icon}
              </div>
              <span className="font-extrabold text-slate-800 text-xs tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[50px] p-10 md:p-16 text-white text-left relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-12 bg-emerald-500"></span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Ritual Harian</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Teknik "Makan Tanpa Trigger"</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed font-medium">Gunakan formula Pro+Pre 25ml sebelum & selepas makan untuk perlindungan mukosa usus yang maksima.</p>
                <div className="flex gap-4">
                  <button onClick={() => navigate('tips')} className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-3xl font-black flex items-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20">
                    MULAKAN RITUAL <ArrowRight className="w-6 h-6" />
                  </button>
                  <button onClick={() => navigate('recipes')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-5 rounded-3xl font-black flex items-center gap-3 transition-all">
                    DAPUR GUTGUARD <ChefHat className="w-5 h-5" />
                  </button>
                </div>
              </div>
           </div>
        </div>
      </header>
    </div>
  );

  const CalendarView = () => (
    <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">7-Day Meal Guide</h2>
        <p className="text-slate-500 font-medium italic">Rancangan pemakanan harian untuk warga Malaysia.</p>
      </div>

      <div className="flex overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar">
        {mealSchedule.map((plan, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 px-10 py-5 rounded-[24px] font-black transition-all ${
              selectedDay === i 
              ? 'bg-emerald-600 text-white shadow-xl scale-105' 
              : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            {plan.day}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-50 flex items-start gap-6 group hover:border-emerald-200 transition-all">
            <div className="bg-amber-50 text-amber-600 p-4 rounded-[20px] group-hover:scale-110 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Breakfast</p>
              <h3 className="text-2xl font-bold text-slate-800">{mealSchedule[selectedDay].breakfast}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-50 flex items-start gap-6 group hover:border-emerald-200 transition-all">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-[20px] group-hover:scale-110 transition-transform">
              <Sun className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lunch</p>
              <h3 className="text-2xl font-bold text-slate-800">{mealSchedule[selectedDay].lunch}</h3>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-50 flex items-start gap-6 group hover:border-emerald-200 transition-all">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-[20px] group-hover:scale-110 transition-transform">
              <Moon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dinner</p>
              <h3 className="text-2xl font-bold text-slate-800">{mealSchedule[selectedDay].dinner}</h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[50px] p-12 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="text-emerald-500 w-12 h-12 opacity-30" />
          </div>
          <h4 className="text-2xl font-black mb-8">Peringatan {mealSchedule[selectedDay].day}</h4>
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <p className="text-emerald-400 font-bold mb-2">Snek Petang</p>
              <p className="text-xl font-bold">{mealSchedule[selectedDay].snack}</p>
            </div>
            <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/30">
              <p className="text-emerald-300 font-bold mb-2">Bancuhan Ritual</p>
              <p className="text-slate-300 italic">"Pastikan minum separuh 25ml Pro/Pre sebelum makan tengahari & malam."</p>
            </div>
            <p className="text-sm text-slate-500 font-medium">Tips: Singgang adalah pilihan terbaik untuk melancarkan sistem penghadaman anda hari ini.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const DietView = () => {
    const foods: FoodItem[] = [
      { name: 'Nasi Putih / Wangi', category: 'Karbo', note: 'Sumber tenaga utama Malaysia.' },
      { name: 'Beras Basmathi', category: 'Karbo', note: 'Indeks glisemik rendah, elak kembung.' },
      { name: 'Ikan Siakap / Jenahak', category: 'Protein', note: 'Protein bersih terbaik.' },
      { name: 'Telur Ayam', category: 'Protein', note: 'Rebus atau goreng non-stick pan.' },
      { name: 'Ayam Dada', category: 'Protein', note: 'Elakkan salutan tepung / gluten.' },
      { name: 'Ikan Kembung / Selar', category: 'Protein', note: 'Bagus untuk singgang atau bakar.' },
      { name: 'Sawi Jepun / Sawi Bunga', category: 'Sayur', note: 'Rendah FODMAP, kaya serat.' },
      { name: 'Bayam', category: 'Sayur', note: 'Masak bening sangat bagus.' },
      { name: 'Labu Manis', category: 'Sayur', note: 'Sesuai untuk sup atau masak lemak putih.' },
      { name: 'Timun', category: 'Ulam', note: 'Ulam paling selamat (buang biji jika sensitif).' },
      { name: 'Pisang Berangan', category: 'Buah', note: 'Pilih yang matang sedang.' },
      { name: 'Betik Madu', category: 'Buah', note: 'Enzim semulajadi bantu cerna.' },
      { name: 'Buah Naga', category: 'Buah', note: 'Pembersih usus yang lembut.' },
      { name: 'Kiwi & Strawberry', category: 'Buah', note: 'Pilihan buah rendah gula.' }
    ];

    const filteredFoods = useMemo(() => 
      foods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())), 
      [searchQuery]
    );

    return (
      <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Bahan Masakan Malaysia</h2>
            <p className="text-slate-500 font-medium">Senarai makanan harian yang selamat untuk perut anda.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari lauk atau sayur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 pl-14 pr-6 py-5 rounded-[24px] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-xl shadow-slate-200/50 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  item.category === 'Karbo' ? 'bg-blue-50 text-blue-600' :
                  item.category === 'Protein' ? 'bg-emerald-50 text-emerald-600' :
                  item.category === 'Sayur' ? 'bg-teal-50 text-teal-600' :
                  item.category === 'Ulam' ? 'bg-green-50 text-green-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {item.category}
                </span>
                <CheckCircle2 className="text-emerald-500 w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{item.name}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PantangView = () => (
    <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-4xl mx-auto text-center">
       <div className="bg-red-50 text-red-600 inline-block p-6 rounded-[32px] mb-8 shadow-inner">
          <Ban className="w-12 h-12" />
       </div>
       <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Zon Pantang</h2>
       <p className="text-slate-500 mb-16 font-medium italic">"Protokol Bulan Pertama — Asas Kesembuhan Anda."</p>

       <div className="grid md:grid-cols-2 gap-4 text-left">
          {[
            { title: 'Bergoreng & Berminyak', desc: 'Santan berlebihan & goreng dalam.' },
            { title: 'Gluten & Tepung Gandum', desc: 'Roti, biskut, mi kuning, pasta.' },
            { title: 'Kafein & Susu Lembu', desc: 'Kopi, teh tarik, susu pekat.' },
            { title: 'Minuman Bergas & Gula', desc: 'Susu tin, soda, jus komersil.' },
            { title: 'Pedas & Rempah Kuat', desc: 'Cili padi, lada hitam berlebihan.' },
            { title: 'Makanan Diperam', desc: 'Budu, belacan, pekasam (sementara).' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[40px] border border-red-50 shadow-lg flex items-center gap-6 group hover:border-red-200 transition-all">
               <div className="bg-red-50 text-red-500 p-4 rounded-2xl group-hover:rotate-12 transition-transform">
                  <XCircle className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">{item.desc}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const RegimenView = () => (
    <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">Sistem Protokol</h2>
        <p className="text-slate-500 font-medium">Bancuhan Probiotik & Prebiotik untuk penyembuhan optimum.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-3">
          {['CARA FLUSHING', 'DAILY DOSE', 'FIREUP BOOST', 'ENERGY DRINK'].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveRegimenTab(i)}
              className={`p-8 rounded-[32px] text-left transition-all border ${
                activeRegimenTab === i 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' 
                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <p className="text-[10px] font-black tracking-widest uppercase mb-2 opacity-60">Step 0{i+1}</p>
              <h3 className="text-xl font-black tracking-tight">{tab}</h3>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white p-10 md:p-16 rounded-[60px] border border-slate-50 shadow-2xl flex flex-col justify-center min-h-[500px]">
          {activeRegimenTab === 0 && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-4xl font-black text-emerald-900 mb-6 uppercase">Ritual Flushing</h3>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed italic">"Membersihkan dinding usus dari sisa toksin selepas hari ke-7 bersama Kaussar."</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <span className="block text-xs font-black text-emerald-600 uppercase mb-2">Probiotik</span>
                  <p className="text-3xl font-black">130 ml</p>
                  <p className="text-xs font-bold text-emerald-800 mt-1">1/2 Botol</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                  <span className="block text-xs font-black text-blue-600 uppercase mb-2">Air Masak</span>
                  <p className="text-3xl font-black">130 ml</p>
                  <p className="text-xs font-bold text-blue-800 mt-1">1/2 Botol</p>
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 md:col-span-2">
                  <span className="block text-xs font-black text-amber-600 uppercase mb-2">Prebiotik</span>
                  <p className="text-3xl font-black">2 Sudu</p>
                </div>
              </div>
            </div>
          )}
          {activeRegimenTab === 1 && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-4xl font-black text-slate-900 mb-8 uppercase">Harian Standard</h3>
              <div className="space-y-8">
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">Bancuhan Utama</h4>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-white px-5 py-3 rounded-2xl font-bold shadow-sm">25ml Probiotik</span>
                    <span className="bg-white px-5 py-3 rounded-2xl font-bold shadow-sm">+ 1 Sudu Prebiotik</span>
                    <span className="bg-white px-5 py-3 rounded-2xl font-bold shadow-sm">+ 250ml Air</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-orange-100 rounded-3xl border border-orange-200">
                    <p className="text-xs font-black text-orange-700 uppercase mb-2 tracking-widest">Healing Crisis</p>
                    <p className="text-2xl font-black text-orange-900">2x Sehari</p>
                  </div>
                  <div className="p-6 bg-emerald-100 rounded-3xl border border-emerald-200">
                    <p className="text-xs font-black text-emerald-700 uppercase mb-2 tracking-widest">Normal Dose</p>
                    <p className="text-2xl font-black text-emerald-900">3x Sehari</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeRegimenTab === 2 && (
            <div className="animate-in fade-in duration-500 text-center">
              <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white p-12 rounded-[50px] shadow-xl inline-block relative overflow-hidden w-full">
                <Zap className="absolute top-0 right-0 w-48 h-48 opacity-10" />
                <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">FireUp Mode</h3>
                <p className="text-xl font-bold mb-10 opacity-90 italic">"Boost pemulihan sekelip mata."</p>
                <div className="bg-white/20 p-8 rounded-[32px] border border-white/30 mb-8 inline-block">
                  <p className="text-4xl font-black">1 SUDU</p>
                  <p className="text-xs uppercase font-bold opacity-80 mt-1 tracking-widest">Tak Perlu Campur Air</p>
                </div>
                <p className="text-sm opacity-80 leading-relaxed font-bold">Ambil sejurus selepas pengambilan dose harian anda.</p>
              </div>
            </div>
          )}
          {activeRegimenTab === 3 && (
            <div className="animate-in fade-in duration-500">
               <h3 className="text-4xl font-black text-blue-900 mb-8 uppercase text-center">Energy Mix</h3>
               <div className="border-4 border-dashed border-blue-50 p-12 rounded-[50px] flex flex-col items-center">
                  <Droplets className="w-16 h-16 text-blue-400 mb-6" />
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <span className="px-4 py-2 bg-blue-50 rounded-xl font-bold text-blue-600">25ml Pro</span>
                    <span className="px-4 py-2 bg-amber-50 rounded-xl font-bold text-amber-600">1-2 Sudu Pre</span>
                    <span className="px-4 py-2 bg-indigo-50 rounded-xl font-bold text-indigo-600">500ml-1L Air</span>
                  </div>
                  <p className="text-center text-slate-500 leading-relaxed font-medium">Sesuai untuk hidrasi berpanjangan sambil membekalkan mikrobiom baik ke dalam sistem secara perlahan.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TipsView = () => (
    <div className="animate-in slide-in-from-right-10 duration-500 pt-28 px-6 pb-24 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Teknik Makan Tanpa Trigger</h2>
        <p className="text-xl text-slate-500 font-medium italic">"Rahsia keselesaan perut warga Malaysia."</p>
      </div>

      <div className="grid gap-6">
        {[
          { icon: <Info className="text-blue-500" />, title: 'Patuhi Pantang', desc: 'Pastikan anda mengikuti pantang larang asas zon merah sebelum teknik ini.' },
          { icon: <Utensils className="text-emerald-500" />, title: 'Ritual Bancuhan', desc: 'Sediakan bancuhan harian (25ml Pro/Pre) sebelum waktu makan.' },
          { icon: <ArrowDownCircle className="text-amber-500" />, title: 'Pre-Meal Step', desc: 'Minum separuh (1/2) bancuhan tepat sebelum suapan pertama.' },
          { icon: <Sun className="text-sky-500" />, title: 'Makan Santai', desc: 'Makan menu rendah FODMAP kegemaran anda secara perlahan-lahan.' },
          { icon: <ShieldAlert className="text-red-500" />, title: 'Henti Awal', desc: 'Berhenti makan sejurus sebelum anda merasa benar-benar kenyang.' },
          { icon: <Droplets className="text-indigo-500" />, title: 'Post-Meal Step', desc: 'Habiskan baki separuh bancuhan tadi sejurus selepas selesai makan.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-lg flex items-start gap-8 group hover:shadow-2xl transition-all">
            <div className="bg-slate-50 p-5 rounded-[24px] group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Step 0{idx+1}</span>
                <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
              </div>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-['Plus_Jakarta_Sans'] text-slate-900">
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-6 py-5 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">GutGuard<span className="text-emerald-500 italic">.</span></span>
          </button>
          
          <div className="hidden lg:flex gap-8">
            {[
              { id: 'diet', label: 'Diet' },
              { id: 'calendar', label: 'Jadual' },
              { id: 'recipes', label: 'Resipi' },
              { id: 'regimen', label: 'Protokol' },
              { id: 'tips', label: 'Ritual' },
              { id: 'pantang', label: 'Pantang' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => navigate(item.id as View)}
                className={`font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:text-emerald-600 ${currentView === item.id ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <button className="hidden md:block bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
               Support
             </button>
             <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-3 bg-slate-50 rounded-2xl">
                <MenuIcon className="w-6 h-6" />
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-10 animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-16">
            <span className="font-black text-3xl tracking-tighter text-emerald-900">Portal</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-100 rounded-full">
              <X />
            </button>
          </div>
          <div className="grid gap-4">
            {[
              { id: 'home', label: 'Dashboard', icon: <Home /> },
              { id: 'diet', label: 'Diet List', icon: <Utensils /> },
              { id: 'calendar', label: 'Jadual Makan', icon: <CalendarIcon /> },
              { id: 'recipes', label: 'Resipi Masak', icon: <ChefHat /> },
              { id: 'regimen', label: 'Protokol', icon: <Clock /> },
              { id: 'tips', label: 'Tips Ritual', icon: <Sparkles /> },
              { id: 'pantang', label: 'Zon Merah', icon: <Ban /> }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => navigate(item.id as View)}
                className="flex items-center gap-6 p-6 bg-slate-50 text-xl font-black rounded-[24px] hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left"
              >
                <div className="text-emerald-600">{item.icon}</div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Content */}
      <main className="pb-32 min-h-screen">
        {currentView === 'home' && <HomeView />}
        {currentView === 'diet' && <DietView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'recipes' && <RecipesView />}
        {currentView === 'pantang' && <PantangView />}
        {currentView === 'regimen' && <RegimenView />}
        {currentView === 'tips' && <TipsView />}
      </main>

      {/* Persistent AI Assistant */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <div className="bg-emerald-500/10 text-emerald-400 inline-block p-4 rounded-3xl mb-6">
                <MessageSquare className="w-8 h-8" />
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">AI Pakar Pemakanan</h2>
             <p className="text-slate-400 text-lg font-medium">Tanya soalan tentang teknik memasak guna Electric Kuali anda.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[60px] overflow-hidden flex flex-col h-[650px] shadow-3xl">
            <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
              {chatMessages.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Sparkles className="text-emerald-400 w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-bold text-xl leading-relaxed">Pakar Dapur Sedia Membantu:<br/><span className="text-sm opacity-50 italic">Cth: "Ayam bakar kuali saya hangit, macam mana nak buat?"</span></p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-8 rounded-[36px] ${
                    msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-xl shadow-emerald-500/20' 
                    : 'bg-white/10 text-slate-100 rounded-bl-none border border-white/10 shadow-lg'
                  }`}>
                    <p className="text-lg font-medium leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[36px] rounded-bl-none animate-pulse flex gap-3 items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                    <span className="text-slate-500 font-bold ml-2">Dapur sedang merancang...</span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChat} className="p-8 bg-white/5 border-t border-white/10 flex gap-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tulis soalan anda..."
                className="flex-1 bg-white/10 border border-white/20 text-white px-10 py-6 rounded-[32px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder:text-slate-600"
              />
              <button 
                type="submit" 
                disabled={isChatLoading}
                className="bg-emerald-500 text-white p-6 rounded-[32px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-2xl shadow-emerald-500/30"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-white px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="text-emerald-600 w-10 h-10" />
              <span className="font-black text-3xl tracking-tighter">GutGuard<span className="text-emerald-500">.</span></span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">Portal kesihatan usus no. 1 untuk pengamal diet Low FODMAP di Malaysia. Berasaskan sains & ritual probiotik semulajadi.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-6 text-slate-800">Explore</p>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><button onClick={() => navigate('diet')}>Food Database</button></li>
                <li><button onClick={() => navigate('calendar')}>Meal Plan</button></li>
                <li><button onClick={() => navigate('recipes')}>Cooking Guide</button></li>
              </ul>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-6 text-slate-800">Support</p>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li>FAQ</li>
                <li>Community</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between gap-6 text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">
          <p>© 2025 GutGuard Health Hub</p>
          <div className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
