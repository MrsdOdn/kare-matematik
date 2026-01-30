import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

function SayiKarti({ sayi }) {
  const [acik, setAcik] = useState(false);
  return (
    <div onClick={() => setAcik(!acik)} className={`kart ${acik ? 'kart-kare' : 'kart-normal'}`}>
      {acik ? (
        <div>
          <span className="kare-sonuc">{sayi * sayi}</span>
          <p className="ipucu">{sayi}x{sayi}</p>
        </div>
      ) : (
        <span className="ana-sayi">{sayi}</span>
      )}
    </div>
  )
}

function App() {
  const [quizModu, setQuizModu] = useState(false);
  const [soru, setSoru] = useState({ sayi: 0, dogruCevap: 0, siklar: [] });
  const [hataMesajı, setHataMesajı] = useState("");
  const sayilar = Array.from({ length: 20 }, (_, i) => i + 1);

  const yeniSoruSor = () => {
    const rastgeleSayi = Math.floor(Math.random() * 20) + 1;
    const dogru = rastgeleSayi * rastgeleSayi;
    
    let yanlis1 = (rastgeleSayi + 1) * (rastgeleSayi + 1);
    let yanlis2 = (rastgeleSayi - 1) * (rastgeleSayi - 1);
    if(rastgeleSayi === 1) yanlis2 = 50;

    const karisikSiklar = [dogru, yanlis1, yanlis2].sort(() => Math.random() - 0.5);
    setSoru({ sayi: rastgeleSayi, dogruCevap: dogru, siklar: karisikSiklar });
  };

  useEffect(() => {
    if (quizModu) yeniSoruSor();
  }, [quizModu]);

  const cevapKontrol = (secilen) => {
    // Ses dosyalarını tanımlayalım (public klasöründe olduklarını varsayıyoruz)
    const dogruSes = new Audio('/dogru.mp3');
    const yanlisSes = new Audio('/yanlis.mp3');

    if (secilen === soru.dogruCevap) {
      dogruSes.play(); // Doğru sesini çal
      setHataMesajı(""); 
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }
      });
      setTimeout(yeniSoruSor, 1000);
    } else {
      yanlisSes.play(); // Yanlış sesini çal
      setHataMesajı("Hoppala! Yaklaştın ama bu değil. Tekrar dene! 💪✨");
      setTimeout(() => setHataMesajı(""), 2000);
    }
  };

  return (
    <div className="ana-konteynir">
      <h1>🌟 Süper Kareler 🌟</h1>

      {!quizModu ? (
        <div id="ogrenme-ekrani">
          <p>Sayıların üzerine dokun ve öğren!</p>
          <div className="kart-izgarasi">
            {sayilar.map((n) => <SayiKarti key={n} sayi={n} />)}
          </div>
          <button className="ana-btn" onClick={() => setQuizModu(true)}>Sınava Başla! 🚀</button>
        </div>
      ) : (
        <div id="quiz-ekrani">
          <div className="quiz-kutusu">
            {hataMesajı && <div className="hata-balonu">{hataMesajı}</div>}
            <h2>{soru.sayi} sayısının karesi hangisi?</h2>
            
            {/* HATA MESAJI BURADA GÖRÜNECEK */}
            

            <div className="sik-alani">
              {soru.siklar.map((sik, index) => (
                <button key={index} className="sik-btn" onClick={() => cevapKontrol(sik)}>
                  {sik}
                </button>
              ))}
            </div>
          </div>
          <button className="ana-btn geri-btn" onClick={() => setQuizModu(false)}>Geri Dön</button>
        </div>
      )}
    </div>
  )
}

export default App