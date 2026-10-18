'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play } from 'lucide-react';
import { asset } from '@/lib/site';

const movies = {
  solar: { src: '/showcase/solar-aia-304.webm', poster: '/showcase/solar-poster.jpg', title: 'SDO / AIA 304 Å', description: 'A solar image sequence exported from the Solar Image Analyzer.' },
  gcs: { src: '/showcase/gcs-cme.webm', poster: '/showcase/gcs-poster.jpg', title: 'GCS CME fitting in motion', description: 'A shared fitted shell follows the CME through multiple viewpoints.' },
};

export default function ExampleMovie({ kind }: { kind: keyof typeof movies }) {
  const movie = movies[kind];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playback, setPlayback] = useState<'auto' | 'playing' | 'paused'>('auto');
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncPlayback = () => {
      const motionAllowed = playback === 'playing' || (playback === 'auto' && !reducedMotion.matches);
      if (visible && !document.hidden && motionAllowed) {
        // A browser may block autoplay; the play button remains available.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 });

    observer.observe(video);
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [playback]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    setPlayback(playing ? 'paused' : 'playing');
    if (playing) video.pause();
    else void video.play().catch(() => {});
  };

  return <figure className="example-movie">
    <div className="movie-stage">
      <video ref={videoRef} muted loop playsInline preload="none" poster={asset(movie.poster)} aria-label={movie.title}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
        <source src={asset(movie.src)} type="video/webm" onError={() => setFailed(true)} />
        Your browser does not support embedded video. Download the example below to view it.
      </video>
      {!failed && <button type="button" className="movie-toggle" onClick={togglePlayback}
        aria-label={`${playing ? 'Pause' : 'Play'} ${movie.title}`} title={playing ? 'Pause animation' : 'Play animation'}>
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>}
    </div>
    <figcaption>
      <strong>{movie.title}</strong>
      <span>{movie.description}</span>
      <a href={asset(movie.src)} download className="movie-download"><Download size={15} />Download example · WebM</a>
      {failed && <p role="status" className="small">The animation could not load. You can download the example using the link above.</p>}
    </figcaption>
  </figure>;
}
