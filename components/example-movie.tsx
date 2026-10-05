'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { asset } from '@/lib/site';

const movies = {
  solar: { src: '/showcase/solar-aia-304.mp4', poster: '/showcase/solar-poster.jpg', title: 'SDO / AIA 304 Å', description: 'A solar image sequence exported from the Solar Image Analyzer.', size: '4.7 MB' },
  gcs: { src: '/showcase/gcs-cme.mp4', poster: '/showcase/gcs-poster.jpg', title: 'GCS CME fitting in motion', description: 'A shared fitted shell follows the CME through multiple viewpoints.', size: '1.4 MB' },
};

export default function ExampleMovie({ kind }: { kind: keyof typeof movies }) {
  const movie = movies[kind];
  const [failed, setFailed] = useState(false);
  return <figure className="example-movie">
    <video controls playsInline preload="none" poster={asset(movie.poster)} aria-label={movie.title} onError={() => setFailed(true)}>
      <source src={asset(movie.src)} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
    <figcaption>
      <strong>{movie.title}</strong>
      <span>{movie.description}</span>
      <a href={asset(movie.src)} download className="movie-download"><Download size={15} />Download example · MP4 · {movie.size}</a>
      {failed && <p role="status" className="small">The video could not load. Try the download link to view it in your video player.</p>}
    </figcaption>
  </figure>;
}
