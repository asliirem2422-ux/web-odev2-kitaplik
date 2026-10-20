import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, Yazi } from "./store";
import "./App.css";

// 1. Ana Sayfa (Yazı Listesi)
function AnaSayfa() {
  const [aramaMetni, setAramaMetni] = useState("");
  const yazilar = useSelector((state: RootState) => state.data);
  const isLoading = useSelector((state: RootState) => state.isLoading);
  const isError = useSelector((state: RootState) => state.isError);
  const dispatch = useDispatch();

  const handleRemovePost = (yazi: Yazi) => {
    dispatch({ type: "REMOVE_POST", payload: yazi });
  };

  const arananYazilar = yazilar.filter((yazi) =>
    yazi.baslik.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  return (
    <div>
      <h2>Yazılar (Redux Store)</h2>
      <div>
        <label htmlFor="arama">Ara: </label>
        <input
          id="arama"
          type="text"
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
        />
      </div>
      <hr />

      {isError && <p style={{ color: "red" }}>Bir hata oluştu!</p>}

      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ul>
          {arananYazilar.map((yazi) => (
            <li key={yazi.id} style={{ marginBottom: "10px" }}>
              {/* Dinamik Detay Sayfasına Link (Slayt 125) */}
              <Link
                to={`/yazi/${yazi.id}`}
                style={{ color: "#38bdf8", fontWeight: "bold" }}
              >
                {yazi.baslik}
              </Link>{" "}
              - <span>{yazi.yazar}</span> (Puan: {yazi.puan}){" "}
              <button onClick={() => handleRemovePost(yazi)}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 2. Dinamik Detay Sayfası (Slayt 125-126)
function YaziDetay() {
  // Slayt 126: useParams hook'u ile URL'deki :id parametresini çekiyoruz
  const { id } = useParams<{ id: string }>();
  const yazilar = useSelector((state: RootState) => state.data);

  // Redux store'dan bu id'ye sahip yazıyı buluyoruz
  const secilenYazi = yazilar.find((y) => y.id === Number(id));

  if (!secilenYazi) {
    return (
      <div>
        <p style={{ color: "#ef4444" }}>Yazı bulunamadı!</p>
        <Link to="/" style={{ color: "#38bdf8" }}>← Listeye Dön</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#262626", padding: "20px", borderRadius: "8px" }}>
      <h2>{secilenYazi.baslik}</h2>
      <p><b>Yazar:</b> {secilenYazi.yazar}</p>
      <p><b>Puan:</b> {secilenYazi.puan}</p>
      <p><b>Yorum Sayısı:</b> {secilenYazi.yorum_sayisi}</p>
      <p>
        <a href={secilenYazi.url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>
          Resmi Kaynağa Git
        </a>
      </p>
      <hr />
      <Link to="/" style={{ color: "#38bdf8" }}>← Ana Sayfaya Dön</Link>
    </div>
  );
}

// 3. Hakkında Sayfası
function Hakkinda() {
  return (
    <div>
      <h2>Hakkımızda</h2>
      <p>Bu proje SDÜ Bilgisayar Mühendisliği Web Teknolojileri ve Programlama dersi için hazırlanmıştır.</p>
    </div>
  );
}

// 4. 404 Sayfa Bulunamadı Bileşeni (Slayt 128)
function SayfaBulunamadi() {
  return (
    <div>
      <h2 style={{ color: "#ef4444" }}>404 - Sayfa Bulunamadı</h2>
      <p>Aradığınız sayfa mevcut değil.</p>
      <Link to="/" style={{ color: "#38bdf8" }}>Ana Sayfaya Dön</Link>
    </div>
  );
}

// Ana Uygulama ve Rotalar
function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>React & Redux & Router Projesi</h1>

        <nav style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <Link to="/" style={{ color: "#38bdf8" }}>Ana Sayfa</Link>
          <Link to="/hakkinda" style={{ color: "#38bdf8" }}>Hakkında</Link>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/hakkinda" element={<Hakkinda />} />
          {/* Slayt 125-126: Dinamik Rota */}
          <Route path="/yazi/:id" element={<YaziDetay />} />
          {/* Slayt 128: Tanımlı olmayan tüm rotalar için 404 sayfası */}
          <Route path="*" element={<SayfaBulunamadi />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;