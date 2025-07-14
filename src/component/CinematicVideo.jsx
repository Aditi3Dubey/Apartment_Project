export default function CinematicVideo() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black px-4 py-6">
      <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/20">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/2v_7UH_nLv4?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1"
          title="Cinematic Apartment Video"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        {/* Optional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
      </div>
    </div>
  );
}
