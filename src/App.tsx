import React, { useState, useEffect } from "react";
import "./App.css";

// Kitap Veri Modeli
interface Kitap {
  id: number;
  baslik: string;
  yazar: string;
  kategori: string;
}

// 1. Sabit Kitap Dizisi (Slayt 68)
const baslangicKitaplar: Kitap[] = [
  { id: 1, baslik: "React'e Giriş", yazar: "D. Usta", kategori: "Web" },
  { id: 2, baslik: "İleri JavaScript", yazar: "S. Kılıç", kategori: "Web" },
  { id: 3, baslik: "Veri Yapıları", yazar: "A. Demir", kategori: "CS" },
  { id: 4, baslik: "Algoritmalar", yazar: "E. Kaya", kategori: "CS" },
  { id: 5, baslik: "UI/UX Temelleri", yazar: "N. Akın", kategori: "Tasarım" },
];

// 2. Arama Çubuğu Bileşeni (Kontrollü Bileşen)
function AramaCubugu({
  aramaMetni,
  onArama,
}: {
  aramaMetni: string;
  onArama: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="text"
      className="arama-input"
      placeholder="Başlık veya yazar ara..."
      value={aramaMetni}
      onChange={onArama}
    />
  );
}

// 3. Kategori Filtre Bileşeni (Kontrollü Select)
function KategoriFiltre({
  kategori,
  onKategoriDegis,
}: {
  kategori: string;
  onKategoriDegis: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select
      className="kategori-select"
      value={kategori}
      onChange={onKategoriDegis}
    >
      <option value="Tümü">Tümü</option>
      <option value="Web">Web</option>
      <option value="CS">CS</option>
      <option value="Tasarım">Tasarım</option>
    </select>
  );
}

// 4. Kitap Kartı Bileşeni (Destructuring kullanıldı)
function KitapKarti({
  id,
  baslik,
  yazar,
  kategori,
  favorideMi,
  onFavoriToggle,
}: Kitap & {
  favorideMi: boolean;
  onFavoriToggle: (id: number) => void;
}) {
  return (
    <div className="kitap-karti">
      <div>
        <h3>{baslik}</h3>
        <p className="kitap-detay">
          {yazar} <span className="kategori-rozet">{kategori}</span>
        </p>
      </div>
      <button
        className={`btn-favori ${favorideMi ? "aktif" : "pasif"}`}
        onClick={() => onFavoriToggle(id)}
      >
        {favorideMi ? "★ Favoride" : "☆ Favori Ekle"}
      </button>
    </div>
  );
}

// 5. Kitap Listesi Bileşeni
function KitapListe({
  kitaplar,
  favoriler,
  onFavoriToggle,
}: {
  kitaplar: Kitap[];
  favoriler: number[];
  onFavoriToggle: (id: number) => void;
}) {
  if (kitaplar.length === 0) {
    return <p style={{ color: "#888" }}>Eşleşen kitap bulunamadı.</p>;
  }

  return (
    <div className="kitap-listesi">
      {kitaplar.map((kitap) => (
        <KitapKarti
          key={kitap.id}
          {...kitap}
          favorideMi={favoriler.includes(kitap.id)}
          onFavoriToggle={onFavoriToggle}
        />
      ))}
    </div>
  );
}

// 6. Favori Paneli Bileşeni
function FavoriPaneli({
  tumKitaplar,
  favoriler,
  onFavoriCikar,
}: {
  tumKitaplar: Kitap[];
  favoriler: number[];
  onFavoriCikar: (id: number) => void;
}) {
  const favoriKitaplar = tumKitaplar.filter((k) => favoriler.includes(k.id));

  return (
    <div className="favori-paneli">
      <h2>Favoriler ({favoriKitaplar.length})</h2>
      {favoriKitaplar.length === 0 ? (
        <p style={{ color: "#777", fontSize: "14px" }}>Henüz favori eklenmedi.</p>
      ) : (
        <ul>
          {favoriKitaplar.map((kitap) => (
            <li key={kitap.id} className="favori-eleman">
              <span>• {kitap.baslik}</span>
              <button
                className="btn-kaldir"
                onClick={() => onFavoriCikar(kitap.id)}
              >
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 7. Ana Kök Bileşen (App)
function App() {
  // State 1: Arama metni (localStorage ile hatırlar)
  const [aramaMetni, setAramaMetni] = useState<string>(() => {
    return localStorage.getItem("kitap_arama") || "";
  });

  // State 2: Seçilen Kategori
  const [kategori, setKategori] = useState<string>("Tümü");

  // State 3: Favoriler listesi (ID dizisi, localStorage ile hatırlar)
  const [favoriler, setFavoriler] = useState<number[]>(() => {
    const kayitliFavoriler = localStorage.getItem("kitap_favoriler");
    return kayitliFavoriler ? JSON.parse(kayitliFavoriler) : [];
  });

  // useEffect 1: Arama metni değiştikçe kaydet
  useEffect(() => {
    localStorage.setItem("kitap_arama", aramaMetni);
  }, [aramaMetni]);

  // useEffect 2: Favoriler değiştikçe kaydet
  useEffect(() => {
    localStorage.setItem("kitap_favoriler", JSON.stringify(favoriler));
  }, [favoriler]);

  // Favori Ekle / Çıkar fonksiyonu
  const handleFavoriToggle = (id: number) => {
    if (favoriler.includes(id)) {
      setFavoriler(favoriler.filter((favId) => favId !== id));
    } else {
      setFavoriler([...favoriler, id]);
    }
  };

  // Filtreleme Mantığı (Hem başlık hem yazar hem kategoriye göre)
  const filtrelenmisKitaplar = baslangicKitaplar.filter((kitap) => {
    const aramaUygun =
      kitap.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      kitap.yazar.toLowerCase().includes(aramaMetni.toLowerCase());

    const kategoriUygun =
      kategori === "Tümü" || kitap.kategori === kategori;

    return aramaUygun && kategoriUygun;
  });

  return (
    <div className="container">
      <h1>Mini Kitaplık</h1>

      {/* Arama ve Filtreleme Kontrolleri */}
      <div className="filtre-alani">
        <AramaCubugu
          aramaMetni={aramaMetni}
          onArama={(e) => setAramaMetni(e.target.value)}
        />
        <KategoriFiltre
          kategori={kategori}
          onKategoriDegis={(e) => setKategori(e.target.value)}
        />
      </div>

      {/* Ana Çift Sütunlu Görünüm */}
      <div className="ana-duzen">
        <KitapListe
          kitaplar={filtrelenmisKitaplar}
          favoriler={favoriler}
          onFavoriToggle={handleFavoriToggle}
        />
        <FavoriPaneli
          tumKitaplar={baslangicKitaplar}
          favoriler={favoriler}
          onFavoriCikar={handleFavoriToggle}
        />
      </div>
    </div>
  );
}

export default App;