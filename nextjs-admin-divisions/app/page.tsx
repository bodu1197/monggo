'use client';

import { useState, useEffect } from 'react';
// Removed useSession, signIn, signOut imports as Header is moved
import Link from 'next/link'; // Keep this import if it is used elsewhere in the file, otherwise remove.
import CategoryList from '@/components/CategoryList'; // Import CategoryList component

interface Province {
  province_id: number;
  province_name: string;
  province_code?: string;
}

interface Regency {
  regency_id: number;
  province_id: number;
  regency_name: string;
  regency_type?: string;
  regency_code?: string;
}

interface District {
  district_id: number;
  regency_id: number;
  district_name: string;
  district_code?: string;
}

// Removed Header component definition

export default function Home() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedRegencyId, setSelectedRegencyId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const selectedProvince = provinces.find(p => p.province_id === selectedProvinceId);
  const selectedRegency = regencies.find(r => r.regency_id === selectedRegencyId);
  const selectedDistrict = districts.find(d => d.district_id === selectedDistrictId);

  // Fetch provinces on mount
  useEffect(() => {
    console.log('Fetching provinces...');
    const fetchProvinces = async () => {
      try {
        const res = await fetch('/api/provinces');
        if (!res.ok) throw new Error('Failed to fetch provinces');
        const data = await res.json();
        setProvinces(data);
        console.log('Provinces fetched:', data.length);
      } catch (error: any) {
        console.error('Error fetching provinces:', error);
        setLocationError(`Failed to load provinces: ${error.message}`);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      const fetchRegencies = async () => {
        try {
          const res = await fetch(`/api/regencies?province_id=${selectedProvinceId}`);
          if (!res.ok) throw new Error('Failed to fetch regencies');
          const data = await res.json();
          setRegencies(data);
          setSelectedRegencyId(null);
          setDistricts([]);
          setSelectedDistrictId(null);
        } catch (error: any) {
          console.error('Error fetching regencies:', error);
          setLocationError(`Failed to load regencies: ${error.message}`);
        }
      };
      fetchRegencies();
    } else {
      setRegencies([]);
      setSelectedRegencyId(null);
      setDistricts([]);
      setSelectedDistrictId(null);
    }
  }, [selectedProvinceId]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (selectedRegencyId) {
      const fetchDistricts = async () => {
        try {
          const res = await fetch(`/api/districts?regency_id=${selectedRegencyId}`);
          if (!res.ok) throw new Error('Failed to fetch districts');
          const data = await res.json();
          setDistricts(data);
          setSelectedDistrictId(null);
        } catch (error: any) {
          console.error('Error fetching districts:', error);
          setLocationError(`Failed to load districts: ${error.message}`);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrictId(null);
    }
  }, [selectedRegencyId]);

  // Geolocation and Reverse Geocoding
  useEffect(() => {
    console.log('Geolocation useEffect triggered. Provinces length:', provinces.length, 'loadingLocation:', loadingLocation);
    if (provinces.length > 0 && loadingLocation) {
      console.log('Provinces data available:', provinces);
      console.log('loadingLocation is true. Geolocation logic would normally run here.');
      // Temporarily disable actual geolocation and reverse geocoding calls
      // to confirm useEffect execution and data availability.
      setLoadingLocation(false); // Set to false to prevent re-running
    } else {
      console.log('Geolocation conditions NOT met. Provinces length:', provinces.length, 'loadingLocation:', loadingLocation);
    }
  }, [provinces, loadingLocation]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(Number(e.target.value));
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegencyId(Number(e.target.value));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictId(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center"> {/* Removed justify-center to allow content to flow */}
      <div className="w-full max-w-7xl md:bg-gray-100 md:p-6 md:rounded-lg md:shadow-xl">
        <div className="flex flex-wrap items-start gap-6">
          {/* Location Selector Group */}
          <div className="flex-1">

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">

                <select
                  id="province"
                  className="shadow-inner border border-gray-300 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={handleProvinceChange}
                  value={selectedProvinceId || ''}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.province_id} value={province.province_id}>
                      {province.province_name} {province.province_code ? `(${province.province_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">

                <select
                  id="regency"
                  className="shadow-inner border border-gray-300 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={handleRegencyChange}
                  value={selectedRegencyId || ''}
                  disabled={!selectedProvinceId}
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  {regencies.map((regency) => (
                    <option key={regency.regency_id} value={regency.regency_id}>
                      {regency.regency_name} {regency.regency_type || regency.regency_code ? `(${regency.regency_type || ''}${regency.regency_type && regency.regency_code ? ', ' : ''}${regency.regency_code || ''})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">

                <select
                  id="district"
                  className="shadow-inner border border-gray-300 rounded w-full py-2 px-3 text-gray-800 leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={handleDistrictChange}
                  value={selectedDistrictId || ''}
                  disabled={!selectedRegencyId}
                >
                  <option value="">Pilih Kecamatan</option>
                  {districts.map((district) => (
                    <option key={district.district_id} value={district.district_id}>
                      {district.district_name} {district.district_code ? `(${district.district_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Selector Group */}
          <div className="flex-1">
            <CategoryList />
          </div>
        </div>
      </div>


    </div>
  );
}
