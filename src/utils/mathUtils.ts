/**
 * Math Utilities for Notary Calculators: GCD, LCM, Fractions, UTM & JAM Code Parsing
 */

// Greatest Common Divisor (ب.م.م)
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Least Common Multiple (ک.م.م)
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
}

// Calculate LCM for an array of numbers
export function lcmArray(numbers: number[]): number {
  const valid = numbers.filter((n) => !isNaN(n) && n > 0);
  if (valid.length === 0) return 1;
  return valid.reduce((acc, curr) => lcm(acc, curr), valid[0]);
}

// Calculate GCD for an array of numbers
export function gcdArray(numbers: number[]): number {
  const valid = numbers.filter((n) => !isNaN(n) && n > 0);
  if (valid.length === 0) return 1;
  return valid.reduce((acc, curr) => gcd(acc, curr), valid[0]);
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export function simplifyFraction(num: number, den: number): Fraction {
  if (den === 0) return { numerator: 0, denominator: 1 };
  const common = gcd(num, den);
  return {
    numerator: Math.round(num / common),
    denominator: Math.round(den / common),
  };
}

/**
 * Parses JAM Code (شناسه ملی جغرافیایی املاک - کد جام سوابق ثبتی ۲۳ یا ۲۴ رقمی)
 * Rules:
 * - First 6 digits: X-Easting (x-ea)
 * - Next 7 digits: Y-Northing (y-no)
 * - Next 2 digits: Zone U (زون UTM در ایران، معمولاً 38, 39, 40 یا 41)
 * - Remaining digits: Parcel/Sub-code identifiers
 */
export interface JamParseResult {
  isValid: boolean;
  rawCode: string;
  xEasting?: number;
  yNorthing?: number;
  zoneU?: number;
  lat?: number;
  lng?: number;
  province?: string;
  errorMessage?: string;
}

export function parseJamCode(raw: string): JamParseResult {
  const clean = raw.replace(/\D/g, '');

  if (clean.length < 15) {
    return {
      isValid: false,
      rawCode: raw,
      errorMessage: 'کد جام وارد شده باید حداقل شامل ۱۵ رقم (ترجیحاً ۲۳ یا ۲۴ رقم) باشد.',
    };
  }

  const xStr = clean.substring(0, 6);
  const yStr = clean.substring(6, 13);
  const zoneStr = clean.substring(13, 15);

  const x = parseInt(xStr, 10);
  const y = parseInt(yStr, 10);
  let zone = parseInt(zoneStr, 10);

  // Fallback zone for Iran if invalid
  if (isNaN(zone) || zone < 38 || zone > 41) {
    zone = 39; // Tehran & Central Iran standard UTM zone
  }

  if (isNaN(x) || isNaN(y)) {
    return {
      isValid: false,
      rawCode: raw,
      errorMessage: 'ارقام مربوط به طول (X) و عرض (Y) UTM ناخوانا می‌باشند.',
    };
  }

  const { lat, lng } = utmToLatLon(x, y, zone);
  const province = detectIranProvince(lat, lng);

  return {
    isValid: true,
    rawCode: clean,
    xEasting: x,
    yNorthing: y,
    zoneU: zone,
    lat,
    lng,
    province,
  };
}

/**
 * UTM WGS84 Zone to Latitude and Longitude conversion
 * Accepts Easting X (meters), Northing Y (meters), Zone (e.g. 39)
 */
export function utmToLatLon(
  easting: number,
  northing: number,
  zone: number,
  northernHemisphere: boolean = true
): { lat: number; lng: number } {
  const a = 6378137; // WGS84 semi-major axis
  const eccSquared = 0.00669438;
  const k0 = 0.9996;

  const x = easting - 500000; // remove 500k offset
  let y = northing;

  if (!northernHemisphere) {
    y -= 10000000;
  }

  const longOrigin = (zone - 1) * 6 - 180 + 3; // central meridian
  const eccPrimeSquared = eccSquared / (1 - eccSquared);

  const M = y / k0;
  const mu = M / (a * (1 - eccSquared / 4 - (3 * eccSquared * eccSquared) / 64 - (5 * Math.pow(eccSquared, 3)) / 256));

  const phi1Rad =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu);

  const N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  const R1 = (a * (1 - eccSquared)) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  const D = x / (N1 * k0);

  let lat =
    phi1Rad -
    ((N1 * Math.tan(phi1Rad)) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * Math.pow(D, 4)) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * Math.pow(D, 6)) / 720);

  lat = (lat * 180) / Math.PI;

  let lng =
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * Math.pow(D, 5)) / 120) /
    Math.cos(phi1Rad);

  lng = longOrigin + (lng * 180) / Math.PI;

  return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
}

const e1 = (1 - Math.sqrt(1 - 0.00669438)) / (1 + Math.sqrt(1 - 0.00669438));

/**
 * Detects approximate Iran Province based on Lat/Lng bounding boxes
 */
export function detectIranProvince(lat: number, lng: number): string {
  if (lat >= 35.4 && lat <= 36.1 && lng >= 51.0 && lng <= 51.8) {
    return 'استان تهران (محدوده شهر تهران و شهرستان‌های همجوار)';
  }
  if (lat >= 35.5 && lat <= 36.3 && lng >= 50.3 && lng <= 51.2) {
    return 'استان البرز (کرج و حومه)';
  }
  if (lat >= 32.2 && lat <= 34.0 && lng >= 50.5 && lng <= 52.5) {
    return 'استان اصفهان';
  }
  if (lat >= 28.5 && lat <= 30.5 && lng >= 51.5 && lng <= 54.0) {
    return 'استان فارس';
  }
  if (lat >= 30.0 && lat <= 32.5 && lng >= 48.0 && lng <= 50.0) {
    return 'استان خوزستان';
  }
  if (lat >= 35.8 && lat <= 37.0 && lng >= 58.5 && lng <= 61.0) {
    return 'استان خراسان رضوی (مشهد)';
  }
  if (lat >= 37.5 && lat <= 39.0 && lng >= 45.0 && lng <= 47.5) {
    return 'استان آذربایجان شرقی (تبریز)';
  }
  if (lat >= 36.0 && lat <= 37.2 && lng >= 51.5 && lng <= 54.0) {
    return 'استان مازندران';
  }
  if (lat >= 34.2 && lat <= 35.0 && lng >= 50.5 && lng <= 51.3) {
    return 'استان قم';
  }
  return 'استان کشوری (محدوده جمهوری اسلامی ایران)';
}
