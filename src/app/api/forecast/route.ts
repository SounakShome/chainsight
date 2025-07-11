import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Mock forecast data
const mockForecastData = {
  'SKU-12345-Milk': {
    regions: {
      'California': {
        currentStock: 2500,
        forecast: [
          { date: '2025-07-10', predicted: 2800, actual: null },
          { date: '2025-07-11', predicted: 3200, actual: null },
          { date: '2025-07-12', predicted: 2900, actual: null },
          { date: '2025-07-13', predicted: 3400, actual: null },
          { date: '2025-07-14', predicted: 4100, actual: null },
          { date: '2025-07-15', predicted: 4500, actual: null },
          { date: '2025-07-16', predicted: 3800, actual: null }
        ],
        historical: [
          { date: '2025-07-03', predicted: 2600, actual: 2750 },
          { date: '2025-07-04', predicted: 3000, actual: 3100 },
          { date: '2025-07-05', predicted: 2800, actual: 2650 },
          { date: '2025-07-06', predicted: 3200, actual: 3350 },
          { date: '2025-07-07', predicted: 3800, actual: 3900 },
          { date: '2025-07-08', predicted: 4200, actual: 4050 },
          { date: '2025-07-09', predicted: 3600, actual: 3700 }
        ],
        accuracy: 94.2,
        trend: 'increasing',
        seasonality: 'summer_peak'
      },
      'Texas': {
        currentStock: 1800,
        forecast: [
          { date: '2025-07-10', predicted: 2100, actual: null },
          { date: '2025-07-11', predicted: 2300, actual: null },
          { date: '2025-07-12', predicted: 2000, actual: null },
          { date: '2025-07-13', predicted: 2400, actual: null },
          { date: '2025-07-14', predicted: 2800, actual: null },
          { date: '2025-07-15', predicted: 3100, actual: null },
          { date: '2025-07-16', predicted: 2700, actual: null }
        ],
        historical: [
          { date: '2025-07-03', predicted: 1900, actual: 2000 },
          { date: '2025-07-04', predicted: 2200, actual: 2150 },
          { date: '2025-07-05', predicted: 2000, actual: 1950 },
          { date: '2025-07-06', predicted: 2300, actual: 2400 },
          { date: '2025-07-07', predicted: 2600, actual: 2650 },
          { date: '2025-07-08', predicted: 2900, actual: 2850 },
          { date: '2025-07-09', predicted: 2500, actual: 2600 }
        ],
        accuracy: 96.8,
        trend: 'stable',
        seasonality: 'summer_normal'
      }
    }
  },
  'SKU-67890-Bread': {
    regions: {
      'Florida': {
        currentStock: 1200,
        forecast: [
          { date: '2025-07-10', predicted: 1400, actual: null },
          { date: '2025-07-11', predicted: 1600, actual: null },
          { date: '2025-07-12', predicted: 1300, actual: null },
          { date: '2025-07-13', predicted: 1500, actual: null },
          { date: '2025-07-14', predicted: 1800, actual: null },
          { date: '2025-07-15', predicted: 2000, actual: null },
          { date: '2025-07-16', predicted: 1700, actual: null }
        ],
        historical: [
          { date: '2025-07-03', predicted: 1100, actual: 1150 },
          { date: '2025-07-04', predicted: 1300, actual: 1280 },
          { date: '2025-07-05', predicted: 1200, actual: 1220 },
          { date: '2025-07-06', predicted: 1400, actual: 1380 },
          { date: '2025-07-07', predicted: 1600, actual: 1650 },
          { date: '2025-07-08', predicted: 1800, actual: 1750 },
          { date: '2025-07-09', predicted: 1500, actual: 1520 }
        ],
        accuracy: 97.1,
        trend: 'increasing',
        seasonality: 'hurricane_prep'
      }
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sku, region } = await request.json();

    if (!sku || !region) {
      return NextResponse.json({ 
        error: 'SKU and region are required' 
      }, { status: 400 });
    }

    // Get forecast data for the requested SKU and region
    const skuData = mockForecastData[sku as keyof typeof mockForecastData];
    
    if (!skuData) {
      return NextResponse.json({ 
        error: 'SKU not found',
        availableSkus: Object.keys(mockForecastData)
      }, { status: 404 });
    }

    const regionData = skuData.regions[region as keyof typeof skuData.regions];
    
    if (!regionData) {
      return NextResponse.json({ 
        error: 'Region not found for this SKU',
        availableRegions: Object.keys(skuData.regions)
      }, { status: 404 });
    }

    return NextResponse.json({
      sku,
      region,
      data: regionData,
      metadata: {
        lastUpdated: new Date().toISOString(),
        modelVersion: '2.1.3',
        confidence: regionData.accuracy
      }
    });
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return available SKUs and regions
    const availableData = Object.keys(mockForecastData).map(sku => ({
      sku,
      regions: Object.keys(mockForecastData[sku as keyof typeof mockForecastData].regions)
    }));

    return NextResponse.json({
      available: availableData,
      totalSkus: Object.keys(mockForecastData).length
    });
  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}