import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, MapPin, Calendar, Clock, Play, Pause, Volume2 } from 'lucide-react';
import { toGoogleCalendarUrl } from "../utils/calendar";

interface CelebrationState {
  showCelebration: boolean;
  flowers: Array<{ id: number; x: number; y: number; delay: number }>;
  fireworks: Array<{ id: number; x: number; y: number; delay: number }>;
}

// Move BotonSi function outside of App component
function createCalendarUrl() {
  const startLocal = new Date("2025-10-24T19:30:00"); // hora local CDMX
  const endLocal   = new Date("2025-10-24T21:30:00");

  return toGoogleCalendarUrl({
    title: "Invitación: Diana E Ian",
    start: startLocal,
    end: endLocal,
    description:
      "¡Te espero! Código de vestimenta: formal. Confirma tu asistencia por mensaje.",
    location: "Av. de la Paz 57, 1er piso, San Ángel, Álvaro Obregón, 01000, CDMX",
    timezone: "America/Mexico_City",
  });
}

function App() {
  const base = import.meta.env.BASE_URL;
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showProposal, setShowProposal] = useState(false);
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [noClickCount, setNoClickCount] = useState(0);
  const [proposalNoScale, setProposalNoScale] = useState(1);
  const [proposalNoPosition, setProposalNoPosition] = useState({ x: 0, y: 0 });
  const [proposalYesScale, setProposalYesScale] = useState(1);
  const [proposalNoClickCount, setProposalNoClickCount] = useState(0);
  const [celebration, setCelebration] = useState<CelebrationState>({
    showCelebration: false,
    flowers: [],
    fireworks: []
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fecha del concierto: 24 de Octubre 2025, 19:30 + 2 horas = 21:30
  const concertEnd = new Date('2025-10-24T21:30:00').getTime();

  // Auto-play music on component mount
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.3;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Auto-play blocked, user interaction required');
          setIsPlaying(false);
        }
      }
    };

    // Small delay to ensure audio element is ready
    setTimeout(playAudio, 500);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = concertEnd - now;

      if (distance > 0) {
        setTimeLeft(distance);
      } else {
        setShowProposal(true);
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [concertEnd]);

  const formatTime = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const time = formatTime(timeLeft);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const createCelebrationAnimation = () => {
    const flowers = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 2000
    }));

    const fireworks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 50 + 10,
      delay: Math.random() * 1000
    }));

    setCelebration({
      showCelebration: true,
      flowers,
      fireworks
    });

    // Hide celebration after 5 seconds
    setTimeout(() => {
      setCelebration(prev => ({ ...prev, showCelebration: false }));
    }, 5000);
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setNoClickCount(prev => prev + 1);
    
    setNoButtonScale(prev => Math.max(0.3, prev - 0.15));
    setYesButtonScale(prev => Math.min(1.5, prev + 0.1));
    
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 100 - 50;
    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleProposalNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setProposalNoClickCount(prev => prev + 1);
    
    setProposalNoScale(prev => Math.max(0.2, prev - 0.2));
    setProposalYesScale(prev => Math.min(2, prev + 0.15));
    
    const newX = Math.random() * 300 - 150;
    const newY = Math.random() * 150 - 75;
    setProposalNoPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    createCelebrationAnimation();
    // Open calendar URL in new tab
    window.open(createCalendarUrl(), '_blank');
  };

  const handleProposalYesClick = () => {
    createCelebrationAnimation();
  };

  const PolaroidImage = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
    <div className="bg-white p-4 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-48">
      <img src={src} alt={alt} className="w-full h-32 object-cover mb-2" />
      <p className="text-sm text-gray-700 text-center font-handwriting">{caption}</p>
    </div>
  );

  if (showProposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="flex justify-center mb-8">
  <audio
    ref={audioRef}
    controls
    preload="metadata"
    playsInline
    src={base + 'bonita.mp3'}
    className="w-full max-w-md"
    onPlay={() => setIsPlaying(true)}
    onPause={() => setIsPlaying(false)}
  />
</div>

        {/* Celebration Animation */}
        {celebration.showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Pink Flowers */}
            {celebration.flowers.map(flower => (
              <div
                key={flower.id}
                className="absolute text-pink-400 animate-bounce opacity-80"
                style={{
                  left: `${flower.x}%`,
                  top: `${flower.y}%`,
                  animationDelay: `${flower.delay}ms`,
                  animationDuration: '3s',
                  fontSize: `${Math.random() * 20 + 20}px`
                }}
              >
                🌸
              </div>
            ))}
            
            {/* Fireworks */}
            {celebration.fireworks.map(firework => (
              <div
                key={firework.id}
                className="absolute animate-ping"
                style={{
                  left: `${firework.x}%`,
                  top: `${firework.y}%`,
                  animationDelay: `${firework.delay}ms`,
                  animationDuration: '1s'
                }}
              >
                <div className="text-4xl">✨</div>
              </div>
            ))}

            {/* Heart explosion */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-6xl">💕</div>
            </div>
          </div>
        )}

        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute text-yellow-300 animate-bounce opacity-30`}
              size={Math.random() * 20 + 10}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center relative border-4 border-yellow-300">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Heart className="text-yellow-400 bg-white rounded-full p-2" size={40} />
          </div>

          <div className="mt-6 mb-8">
            <h1 className="text-6xl font-bold text-yellow-600 mb-4 animate-pulse">
              💕 ¡Momento Especial! 💕
            </h1>
            <div className="text-4xl font-bold text-gray-800 mb-6">
              ¿Puedo ser tu novio?
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Diana Laura, después de esta hermosa velada musical,
              me encantaría poder cuidarte amarte y respetarte... 💖
            </p>
            
            {/* Polaroid Images */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <PolaroidImage 
                src={base + 'flores2.jpg'} 
                alt="Momento especial" 
                caption="Nuestros momentos ✨"
              />
              <PolaroidImage 
                src={base + 'rosas.jpg'} 
                alt="Recuerdo hermoso" 
                caption="Contigo siempre 💕"
              />
            </div>
          </div>


          <div className="flex justify-center items-center gap-8 relative h-32">
            <button
              onClick={handleProposalYesClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300"
              style={{ 
                transform: `scale(${proposalYesScale}) hover:scale(${proposalYesScale * 1.05})`,
                transition: 'transform 0.3s ease'
              }}
            >
              ¡SÍ! 💕
            </button>
            
            <button
              onClick={handleProposalNoClick}
              className="bg-gray-400 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 relative"
              style={{ 
                transform: `scale(${proposalNoScale}) translate(${proposalNoPosition.x}px, ${proposalNoPosition.y}px)`,
                transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              }}
            >
              {proposalNoClickCount > 5 ? '😢' : proposalNoClickCount > 3 ? 'No...' : 'No'}
            </button>
          </div>

          {proposalNoClickCount > 0 && (
            <div className="mt-6 text-lg text-yellow-600">
              {proposalNoClickCount === 1 && "¿Estás segura? 🥺"}
              {proposalNoClickCount === 2 && "Pero... ¡fue una noche tan hermosa! 💫"}
              {proposalNoClickCount === 3 && "¿No te gustó el concierto? 🎵"}
              {proposalNoClickCount === 4 && "Solo dame una oportunidad... 💝"}
              {proposalNoClickCount === 5 && "¡Por favor! 🙏"}
              {proposalNoClickCount > 5 && "Ok, entiendo... pero ¿segura? 💔"}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={toggleMusic}
              className="bg-yellow-100 text-yellow-700 p-3 rounded-full hover:bg-yellow-200 transition-colors duration-300 flex items-center gap-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Celebration Animation */}
      {celebration.showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Pink Flowers */}
          {celebration.flowers.map(flower => (
            <div
              key={flower.id}
              className="absolute text-pink-400 animate-bounce opacity-80"
              style={{
                left: `${flower.x}%`,
                top: `${flower.y}%`,
                animationDelay: `${flower.delay}ms`,
                animationDuration: '3s',
                fontSize: `${Math.random() * 20 + 20}px`
              }}
            >
              🌸
            </div>
          ))}
          
          {/* Fireworks */}
          {celebration.fireworks.map(firework => (
            <div
              key={firework.id}
              className="absolute animate-ping"
              style={{
                left: `${firework.x}%`,
                top: `${firework.y}%`,
                animationDelay: `${firework.delay}ms`,
                animationDuration: '1s'
              }}
            >
              <div className="text-4xl">✨</div>
            </div>
          ))}

          {/* Heart explosion */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-6xl">💕</div>
          </div>
        </div>
      )}

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-yellow-300 animate-bounce opacity-20`}
            size={Math.random() * 15 + 8}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          />
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-4xl w-full text-center relative border-4 border-yellow-300">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Heart className="text-yellow-400 bg-white rounded-full p-3 border-4 border-yellow-300" size={50} />
        </div>

        {/* Header */}
        <div className="mt-8 mb-8">
          <h1 className="text-5xl font-bold text-yellow-600 mb-2">
            💕 Invitación Especial 💕
          </h1>
          <p className="text-2xl text-gray-700 font-semibold">
            Para: <span className="text-yellow-600">Diana Laura Contreras</span>
          </p>
        </div>

        {/*NUEVO BOTON DE REPRODUCCION*/ }
                {/* Music Control */}
        <div className="flex justify-center">
          <button
            onClick={toggleMusic}
            className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-full hover:bg-yellow-200 transition-colors duration-300 flex items-center gap-2 font-semibold"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <Volume2 size={20} />
            <span>{isPlaying ? 'Pausar música' : 'Reproducir música romántica'}</span>
          </button>
        </div>
        <br></br>
        <br></br>
        {/* Polaroid Images Gallery */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <PolaroidImage 
            src={base + 'amor1.jpg'} 
            alt="Momento especial 1" 
            caption="Que bonitos ojos tienes 🎵"
          />
          <PolaroidImage 
            src={base + 'amor2.jpg'} 
            alt="Momento especial 2" 
            caption="Que bonita noche hoy 💕"
          />
          <PolaroidImage 
            src={base + 'flores1.jpg'} 
            alt="Momento especial 3" 
            caption="Que bonita tu, que bonita tu,ereees ✨"
          />
        </div>

        {/* Event Details */}
        <div className="bg-yellow-50 rounded-2xl p-6 mb-8 border-2 border-yellow-200">
          <div className="flex items-center justify-center mb-4">
            <Music className="text-yellow-600 mr-2" size={30} />
            <h2 className="text-3xl font-bold text-gray-800">Concierto de Sebastian Romero</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start">
              <Calendar className="text-yellow-600 mr-3 mt-1" size={24} />
              <div>
                <p className="font-bold text-gray-800">Fecha y Hora:</p>
                <p className="text-gray-700">Viernes 24 de Octubre 2025</p>
                <p className="text-gray-700">19:30 hrs</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="text-yellow-600 mr-3 mt-1" size={24} />
              <div>
                <p className="font-bold text-gray-800">Lugar:</p>
                <p className="text-gray-700">FORO LA PAZ</p>
                <p className="text-gray-700">Av. de la Paz 57, 1er piso</p>
                <p className="text-gray-700">San Ángel, Álvaro Obregón</p>
                <p className="text-gray-700">01000, CDMX</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="mr-2" size={30} />
            <h3 className="text-2xl font-bold">Tiempo hasta el final del concierto:</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold">{time.days}</div>
              <div className="text-sm">Días</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold">{time.hours}</div>
              <div className="text-sm">Horas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold">{time.minutes}</div>
              <div className="text-sm">Minutos</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-3xl font-bold">{time.seconds}</div>
              <div className="text-sm">Segundos</div>
            </div>
          </div>
        </div>

        {/* RSVP */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">¿Confirmas tu asistencia?</h3>
          
          <div className="flex justify-center items-center gap-8 relative h-32">
            <button
              onClick={handleYesClick}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300"
              style={{ 
                transform: `scale(${yesButtonScale}) hover:scale(${yesButtonScale * 1.05})`,
                transition: 'transform 0.3s ease'
              }}
            >
              ¡SÍ, IRÉ! 💕
            </button>
            
            <button
              onClick={handleNoClick}
              className="bg-gray-400 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 relative"
              style={{ 
                transform: `scale(${noButtonScale}) translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              }}
            >
              {noClickCount > 4 ? '😢' : noClickCount > 2 ? 'No...' : 'No puedo'}
            </button>
          </div>

          {noClickCount > 0 && (
            <div className="mt-6 text-lg text-yellow-600">
              {noClickCount === 1 && "¿Estás segura? ¡Va a ser increíble! 🎵"}
              {noClickCount === 2 && "¡Pero es Sebastian Romero! 🌟"}
              {noClickCount === 3 && "¡Por favor, será una noche mágica! ✨"}
              {noClickCount === 4 && "¡Solo esta vez! 🥺"}
              {noClickCount > 4 && "Ok, pero ¿segura que no? 💔"}
            </div>
          )}
        </div>



        <div className="mt-6 text-sm text-gray-500">
          💝 Con amor y muchas ganas de compartir esta experiencia contigo 💝
        </div>
      </div>
    </div>
  );
}

export default App;