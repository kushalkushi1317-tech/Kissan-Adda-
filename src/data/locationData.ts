/**
 * Hierarchical location data for India, with exhaustive Karnataka coverage
 * Supports State -> District -> City/Town -> Market/APMC dependent selection.
 */

export interface LocationCity {
  name: string;
  markets: string[]; // Mandi names or IDs
}

export interface LocationDistrict {
  name: string;
  cities: LocationCity[];
}

export interface LocationState {
  name: string;
  districts: LocationDistrict[];
}

export const LOCATION_HIERARCHY: LocationState[] = [
  {
    name: 'Karnataka',
    districts: [
      {
        name: 'Davanagere',
        cities: [
          {
            name: 'Davanagere',
            markets: ['Davanagere APMC Market Yard', 'Davanagere Fruit Market', 'Davanagere Onion Market']
          },
          {
            name: 'Harihara',
            markets: ['Harihara APMC']
          },
          {
            name: 'Channagiri',
            markets: ['Channagiri APMC']
          },
          {
            name: 'Honnali',
            markets: ['Honnali APMC']
          },
          {
            name: 'Harapanahalli',
            markets: ['Harapanahalli APMC']
          },
          {
            name: 'Jagalur',
            markets: ['Jagalur APMC']
          },
          {
            name: 'Nyamathi',
            markets: ['Honnali APMC (Nyamathi Sub-Yard)']
          }
        ]
      },
      {
        name: 'Bengaluru Urban',
        cities: [
          {
            name: 'Bengaluru',
            markets: ['Yeshwanthpur APMC Bangalore', 'KR Market Bengaluru', 'Singena Agrahara Fruit Market', 'Binny Mill Grain Market']
          }
        ]
      },
      {
        name: 'Bengaluru Rural',
        cities: [
          {
            name: 'Doddaballapura',
            markets: ['Doddaballapura APMC']
          },
          {
            name: 'Devanahalli',
            markets: ['Devanahalli APMC']
          },
          {
            name: 'Hosakote',
            markets: ['Hosakote APMC']
          },
          {
            name: 'Nelamangala',
            markets: ['Nelamangala Sub-Yard']
          }
        ]
      },
      {
        name: 'Mysuru',
        cities: [
          {
            name: 'Mysuru',
            markets: ['Mysuru Bandipalya APMC', 'Mysuru Devaraja Market']
          },
          {
            name: 'Nanjangud',
            markets: ['Nanjangud APMC']
          },
          {
            name: 'Hunsur',
            markets: ['Hunsur APMC (Tobacco & Grain)']
          },
          {
            name: 'T. Narasipura',
            markets: ['T. Narasipura Sub-Yard']
          }
        ]
      },
      {
        name: 'Belagavi',
        cities: [
          {
            name: 'Belagavi',
            markets: ['Belagavi APMC Yard']
          },
          {
            name: 'Gokak',
            markets: ['Gokak APMC']
          },
          {
            name: 'Bailhongal',
            markets: ['Bailhongal APMC (Cotton)']
          },
          {
            name: 'Chikkodi',
            markets: ['Chikkodi APMC']
          },
          {
            name: 'Athani',
            markets: ['Athani APMC']
          }
        ]
      },
      {
        name: 'Dharwad',
        cities: [
          {
            name: 'Hubballi',
            markets: ['Hubballi APMC Amargol Yard']
          },
          {
            name: 'Dharwad',
            markets: ['Dharwad APMC Yard']
          },
          {
            name: 'Kundgol',
            markets: ['Kundgol APMC (Cotton & Chilli)']
          },
          {
            name: 'Navalgund',
            markets: ['Navalgund APMC']
          }
        ]
      },
      {
        name: 'Ballari',
        cities: [
          {
            name: 'Ballari',
            markets: ['Ballari APMC Yard']
          },
          {
            name: 'Siruguppa',
            markets: ['Siruguppa APMC (Paddy & Rice)']
          },
          {
            name: 'Kampli',
            markets: ['Kampli Sub-Yard']
          }
        ]
      },
      {
        name: 'Vijayapura',
        cities: [
          {
            name: 'Vijayapura',
            markets: ['Vijayapura APMC Yard (Grapes & Onion)']
          },
          {
            name: 'Indi',
            markets: ['Indi APMC (Lime & Lemon)']
          },
          {
            name: 'Sindagi',
            markets: ['Sindagi APMC']
          }
        ]
      },
      {
        name: 'Kalaburagi',
        cities: [
          {
            name: 'Kalaburagi',
            markets: ['Kalaburagi APMC Nehru Gunj (Tur Hub)']
          },
          {
            name: 'Aland',
            markets: ['Aland APMC']
          },
          {
            name: 'Sedam',
            markets: ['Sedam APMC']
          }
        ]
      },
      {
        name: 'Shivamogga',
        cities: [
          {
            name: 'Shivamogga',
            markets: ['Shivamogga APMC (Arecanut & Paddy)']
          },
          {
            name: 'Sagar',
            markets: ['Sagar APMC (Arecanut)']
          },
          {
            name: 'Bhadravathi',
            markets: ['Bhadravathi APMC']
          },
          {
            name: 'Shikaripura',
            markets: ['Shikaripura APMC']
          }
        ]
      },
      {
        name: 'Chitradurga',
        cities: [
          {
            name: 'Chitradurga',
            markets: ['Chitradurga APMC (Cotton & Groundnut)']
          },
          {
            name: 'Challakere',
            markets: ['Challakere APMC (Oilseeds & Groundnut Hub)']
          },
          {
            name: 'Hiriyur',
            markets: ['Hiriyur APMC']
          },
          {
            name: 'Holalkere',
            markets: ['Holalkere Sub-Yard']
          }
        ]
      },
      {
        name: 'Haveri',
        cities: [
          {
            name: 'Byadgi',
            markets: ['Byadgi APMC (Asia Red Chilli Hub)']
          },
          {
            name: 'Ranebennur',
            markets: ['Ranebennur APMC (Seeds & Vegetable)']
          },
          {
            name: 'Haveri',
            markets: ['Haveri APMC Yard']
          }
        ]
      },
      {
        name: 'Gadag',
        cities: [
          {
            name: 'Gadag',
            markets: ['Gadag APMC (Cotton & Onion)']
          },
          {
            name: 'Ron',
            markets: ['Ron APMC']
          },
          {
            name: 'Nargund',
            markets: ['Nargund Sub-Yard']
          }
        ]
      },
      {
        name: 'Bagalkote',
        cities: [
          {
            name: 'Bagalkote',
            markets: ['Bagalkote APMC']
          },
          {
            name: 'Jamkhandi',
            markets: ['Jamkhandi APMC (Sugarcane & Maize)']
          },
          {
            name: 'Mudhol',
            markets: ['Mudhol APMC']
          }
        ]
      },
      {
        name: 'Koppal',
        cities: [
          {
            name: 'Gangavathi',
            markets: ['Gangavathi APMC (Paddy / Sona Masuri Hub)']
          },
          {
            name: 'Koppal',
            markets: ['Koppal APMC']
          },
          {
            name: 'Kushtagi',
            markets: ['Kushtagi APMC']
          }
        ]
      },
      {
        name: 'Raichur',
        cities: [
          {
            name: 'Raichur',
            markets: ['Raichur APMC (Cotton & Groundnut)']
          },
          {
            name: 'Sindhanur',
            markets: ['Sindhanur APMC (Paddy Hub)']
          },
          {
            name: 'Manvi',
            markets: ['Manvi APMC']
          }
        ]
      },
      {
        name: 'Tumakuru',
        cities: [
          {
            name: 'Tiptur',
            markets: ['Tiptur APMC (Asia Copra & Coconut Hub)']
          },
          {
            name: 'Tumakuru',
            markets: ['Tumakuru APMC (Batawadi Yard)']
          },
          {
            name: 'Sira',
            markets: ['Sira APMC (Groundnut)']
          },
          {
            name: 'Madhugiri',
            markets: ['Madhugiri APMC']
          }
        ]
      },
      {
        name: 'Hassan',
        cities: [
          {
            name: 'Hassan',
            markets: ['Hassan APMC (Potato & Maize)']
          },
          {
            name: 'Sakleshpur',
            markets: ['Sakleshpur APMC (Coffee & Cardamom)']
          },
          {
            name: 'Arsikere',
            markets: ['Arsikere APMC (Coconut)']
          },
          {
            name: 'Channarayapatna',
            markets: ['Channarayapatna APMC']
          }
        ]
      },
      {
        name: 'Mandya',
        cities: [
          {
            name: 'Mandya',
            markets: ['Mandya APMC (Jaggery & Sugarcane)']
          },
          {
            name: 'Maddur',
            markets: ['Maddur Tender Coconut Market']
          },
          {
            name: 'Pandavapura',
            markets: ['Pandavapura Sub-Yard']
          }
        ]
      },
      {
        name: 'Chikkamagaluru',
        cities: [
          {
            name: 'Chikkamagaluru',
            markets: ['Chikkamagaluru APMC (Coffee & Pepper)']
          },
          {
            name: 'Tarikere',
            markets: ['Tarikere APMC']
          },
          {
            name: 'Kadur',
            markets: ['Kadur APMC (Onion & Coconut)']
          }
        ]
      },
      {
        name: 'Udupi',
        cities: [
          {
            name: 'Udupi',
            markets: ['Udupi APMC Adi Udupi Yard']
          },
          {
            name: 'Kundapura',
            markets: ['Kundapura APMC']
          },
          {
            name: 'Karkala',
            markets: ['Karkala Sub-Yard']
          }
        ]
      },
      {
        name: 'Dakshina Kannada',
        cities: [
          {
            name: 'Mangaluru',
            markets: ['Mangaluru APMC Baikampady Yard', 'CAMPCO Central Market']
          },
          {
            name: 'Bantwal',
            markets: ['Bantwal APMC']
          },
          {
            name: 'Puttur',
            markets: ['Puttur APMC (Arecanut)']
          }
        ]
      },
      {
        name: 'Uttara Kannada',
        cities: [
          {
            name: 'Sirsi',
            markets: ['Sirsi APMC (TSS Arecanut & Spices)']
          },
          {
            name: 'Kumta',
            markets: ['Kumta APMC']
          },
          {
            name: 'Honnavar',
            markets: ['Honnavar Sub-Yard']
          }
        ]
      },
      {
        name: 'Kodagu',
        cities: [
          {
            name: 'Madikeri',
            markets: ['Madikeri APMC (Coffee & Cardamom)']
          },
          {
            name: 'Gonikoppal',
            markets: ['Gonikoppal Sub-Yard']
          }
        ]
      },
      {
        name: 'Kolar',
        cities: [
          {
            name: 'Kolar',
            markets: ['Kolar APMC Yard (Asia Tomato Hub)']
          },
          {
            name: 'Srinivaspur',
            markets: ['Srinivaspur APMC (Asia Mango Hub)']
          },
          {
            name: 'Bangarapet',
            markets: ['Bangarapet APMC']
          },
          {
            name: 'Malur',
            markets: ['Malur APMC (Vegetable)']
          }
        ]
      },
      {
        name: 'Chikkaballapura',
        cities: [
          {
            name: 'Chikkaballapura',
            markets: ['Chikkaballapura APMC (Potato & Grape)']
          },
          {
            name: 'Chintamani',
            markets: ['Chintamani APMC (Tomato & Silk)']
          },
          {
            name: 'Gauribidanur',
            markets: ['Gauribidanur APMC']
          }
        ]
      },
      {
        name: 'Ramanagara',
        cities: [
          {
            name: 'Ramanagara',
            markets: ['Ramanagara APMC (Silk Cocoon & Mango)']
          },
          {
            name: 'Channapatna',
            markets: ['Channapatna APMC']
          },
          {
            name: 'Kanakapura',
            markets: ['Kanakapura APMC']
          }
        ]
      },
      {
        name: 'Chamarajanagar',
        cities: [
          {
            name: 'Chamarajanagar',
            markets: ['Chamarajanagar APMC']
          },
          {
            name: 'Kollegal',
            markets: ['Kollegal APMC']
          },
          {
            name: 'Gundlupet',
            markets: ['Gundlupet APMC (Vegetables)']
          }
        ]
      },
      {
        name: 'Bidar',
        cities: [
          {
            name: 'Bidar',
            markets: ['Bidar APMC (Soybean & Pulses)']
          },
          {
            name: 'Humnabad',
            markets: ['Humnabad APMC']
          },
          {
            name: 'Basavakalyan',
            markets: ['Basavakalyan APMC']
          }
        ]
      },
      {
        name: 'Yadgir',
        cities: [
          {
            name: 'Yadgir',
            markets: ['Yadgir APMC (Paddy & Cotton)']
          },
          {
            name: 'Shahapur',
            markets: ['Shahapur APMC']
          },
          {
            name: 'Surpur',
            markets: ['Surpur APMC']
          }
        ]
      },
      {
        name: 'Vijayanagara',
        cities: [
          {
            name: 'Hosapete',
            markets: ['Hosapete APMC']
          },
          {
            name: 'Hagaribommanahalli',
            markets: ['Hagaribommanahalli APMC']
          },
          {
            name: 'Harapanahalli',
            markets: ['Harapanahalli APMC']
          },
          {
            name: 'Kotturu',
            markets: ['Kotturu APMC']
          }
        ]
      }
    ]
  },
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Nashik',
        cities: [
          { name: 'Lasalgaon', markets: ['Lasalgaon APMC'] },
          { name: 'Pimpalgaon', markets: ['Pimpalgaon Baswant APMC'] },
          { name: 'Nashik', markets: ['Nashik APMC Yard'] }
        ]
      },
      {
        name: 'Mumbai Suburban',
        cities: [
          { name: 'Navi Mumbai', markets: ['Vashi APMC Navi Mumbai'] }
        ]
      },
      {
        name: 'Pune',
        cities: [
          { name: 'Pune', markets: ['Pune APMC Gultekdi Market'] }
        ]
      }
    ]
  },
  {
    name: 'Delhi NCR',
    districts: [
      {
        name: 'North Delhi',
        cities: [
          { name: 'Azadpur', markets: ['Azadpur Mandi'] }
        ]
      },
      {
        name: 'East Delhi',
        cities: [
          { name: 'Ghazipur', markets: ['Ghazipur Fruit & Vegetable Mandi'] }
        ]
      }
    ]
  },
  {
    name: 'Andhra Pradesh',
    districts: [
      {
        name: 'Guntur',
        cities: [
          { name: 'Guntur', markets: ['Guntur Mirchi Yard'] }
        ]
      },
      {
        name: 'Kurnool',
        cities: [
          { name: 'Kurnool', markets: ['Kurnool APMC Market'] }
        ]
      }
    ]
  },
  {
    name: 'Telangana',
    districts: [
      {
        name: 'Warangal',
        cities: [
          { name: 'Warangal', markets: ['Warangal Enumamula APMC'] }
        ]
      },
      {
        name: 'Suryapet',
        cities: [
          { name: 'Suryapet', markets: ['Suryapet APMC Yard'] }
        ]
      }
    ]
  },
  {
    name: 'Punjab',
    districts: [
      {
        name: 'Ludhiana',
        cities: [
          { name: 'Khanna', markets: ['Khanna Grain Market'] }
        ]
      }
    ]
  },
  {
    name: 'Madhya Pradesh',
    districts: [
      {
        name: 'Neemuch',
        cities: [
          { name: 'Neemuch', markets: ['Neemuch Krishi Upaj Mandi'] }
        ]
      },
      {
        name: 'Indore',
        cities: [
          { name: 'Indore', markets: ['Indore Devi Ahilya Mandi'] }
        ]
      }
    ]
  },
  {
    name: 'Gujarat',
    districts: [
      {
        name: 'Rajkot',
        cities: [
          { name: 'Rajkot', markets: ['Rajkot APMC Bedi Yard'] }
        ]
      }
    ]
  },
  {
    name: 'Uttar Pradesh',
    districts: [
      {
        name: 'Agra',
        cities: [
          { name: 'Agra', markets: ['Agra Mandi Samiti'] }
        ]
      }
    ]
  },
  {
    name: 'Rajasthan',
    districts: [
      {
        name: 'Kota',
        cities: [
          { name: 'Kota', markets: ['Kota Bhamashah Mandi'] }
        ]
      }
    ]
  }
];

export const getAllStates = (): string[] => {
  return LOCATION_HIERARCHY.map(s => s.name);
};

export const getDistrictsByState = (stateName: string): string[] => {
  const st = LOCATION_HIERARCHY.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return st ? st.districts.map(d => d.name) : [];
};

export const getCitiesByDistrict = (stateName: string, districtName: string): string[] => {
  const st = LOCATION_HIERARCHY.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  if (!st) return [];
  const dist = st.districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  return dist ? dist.cities.map(c => c.name) : [];
};

export const getMarketsByLocation = (
  stateName?: string, 
  districtName?: string, 
  cityName?: string
): string[] => {
  if (!stateName) return [];
  const st = LOCATION_HIERARCHY.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  if (!st) return [];

  if (districtName) {
    const dist = st.districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    if (!dist) return [];

    if (cityName) {
      const city = dist.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      return city ? city.markets : [];
    }
    // Return all markets in the district across all towns
    return Array.from(new Set(dist.cities.flatMap(c => c.markets)));
  }

  // Return all markets in the state
  return Array.from(new Set(st.districts.flatMap(d => d.cities.flatMap(c => c.markets))));
};
