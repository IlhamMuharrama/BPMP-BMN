import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

const KEMENDIKBUD_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png';

interface LogoImageProps {
  src?: string;
  logoUrl?: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function LogoImage({
  src,
  logoUrl,
  alt = 'Logo BPMP',
  className = 'w-full h-full object-contain',
  fallbackClassName = 'w-full h-full object-contain flex items-center justify-center'
}: LogoImageProps) {
  // Determine initial source: src -> logoUrl -> /logo.png -> KEMENDIKBUD_LOGO
  const initialSrc = src || logoUrl || '/logo.png';
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [errorStage, setErrorStage] = useState<number>(0);

  useEffect(() => {
    const nextSrc = src || logoUrl || '/logo.png';
    setImgSrc(nextSrc);
    setErrorStage(0);
  }, [src, logoUrl]);

  const handleError = () => {
    if (errorStage === 0) {
      // Stage 1: If we started with /logo.png or src, fallback to logoUrl or KEMENDIKBUD_LOGO
      if (logoUrl && imgSrc !== logoUrl) {
        setImgSrc(logoUrl);
      } else if (imgSrc !== KEMENDIKBUD_LOGO) {
        setImgSrc(KEMENDIKBUD_LOGO);
      } else {
        setImgSrc('/logo.png');
      }
      setErrorStage(1);
    } else if (errorStage === 1) {
      // Stage 2: Fallback to KEMENDIKBUD_LOGO if not already tried
      if (imgSrc !== KEMENDIKBUD_LOGO) {
        setImgSrc(KEMENDIKBUD_LOGO);
        setErrorStage(2);
      } else {
        setErrorStage(3); // Render fallback icon
      }
    } else {
      setErrorStage(3); // Render fallback icon
    }
  };

  if (errorStage >= 3) {
    return (
      <div className={`bg-blue-600/90 text-white rounded-xl font-bold p-2 shadow-sm ${fallbackClassName}`}>
        <Building2 className="w-full h-full" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
