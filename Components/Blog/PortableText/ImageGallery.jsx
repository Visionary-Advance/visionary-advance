// Components/Blog/PortableText/ImageGallery.jsx
// Image gallery component for blog posts

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';
import { X } from 'lucide-react';

export default function ImageGallery({ value }) {
  const { images = [], caption } = value;
  const [lightboxImage, setLightboxImage] = useState(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="my-8">
        {/* Gallery Grid */}
        <div className={`grid gap-4 ${
          images.length === 1 ? 'grid-cols-1' :
          images.length === 2 ? 'grid-cols-2' :
          'grid-cols-2 md:grid-cols-3'
        }`}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setLightboxImage(image)}
              className="relative aspect-square overflow-hidden rounded-lg border border-white/10 hover:border-[#008070]/50 transition-all cursor-pointer group"
            >
              <Image
                src={urlForImage(image).width(600).height(600).url()}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        {/* Caption */}
        {caption && (
          <p className="font-manrope text-sm text-gray-400 text-center mt-4">
            {caption}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} className="text-white" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={urlForImage(lightboxImage).width(1600).height(1200).url()}
              alt={lightboxImage.alt || 'Gallery image'}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
