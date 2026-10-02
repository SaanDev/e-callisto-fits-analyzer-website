'use client';

import { useState } from 'react';

const movies = {
  solar: { src: '/showcase/solar-aia-304.mp4', poster: '/showcase/solar-poster.jpg', title: 'SDO / AIA 304 Å', description: 'A solar image sequence exported from the Solar Image Analyzer.', size: '4.7 MB' },
  gcs: { src: '/showcase/gcs-cme.mp4', poster: '/showcase/gcs-poster.jpg', title: 'GCS CME fitting in motion', description: 'A shared fitted shell follows the CME through multiple viewpoints.', size: '1.4 MB' },
};

export default function ExampleMovie({ kind }: { kind: keyof typeof movies }) {
  const movie = movies[kind];
  const [failed, setFailed] = useState(false);
  return <figure className="example-movie">
    <video controls playsInline preload="none" poster={movie.poster} aria-label={movie.title} onError={() => setFailed(true)}>
      <source src={movie.src} type="video/mp4"/>
      Your browser does not support embedded video.
    </video>
    <figcaption><strong>{movie.title}</strong><span>{movie.description}</span><a href={movie.src} download className="movie-download">Download example · MP4 · {movie.size}</a>{failed && <p role="status">The video could not load. Try the download link to view it in your video player.</p>}</figcaption>
  </figure>;
}
