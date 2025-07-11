import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Mock disruption data
const mockDisruptions = [
  {
    id: '1',
    type: 'weather',
    severity: 'high',
    title: 'Hurricane Warning - Southeast Region',
    description: 'Major hurricane approaching Florida coast, expect supply chain disruptions',
    location: { lat: 28.5383, lng: -81.3792 },
    region: 'Southeast',
    timestamp: new Date().toISOString(),
    affectedStores: 156,
    estimatedImpact: '$2.3M',
    status: 'active'
  },
  {
    id: '2',
    type: 'logistics',
    severity: 'medium',
    title: 'Port Strike - West Coast',
    description: 'Longshoremen strike affecting Los Angeles and Long Beach ports',
    location: { lat: 33.7701, lng: -118.1937 },
    region: 'West Coast',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    affectedStores: 89,
    estimatedImpact: '$1.8M',
    status: 'active'
  },
  {
    id: '3',
    type: 'supplier',
    severity: 'low',
    title: 'Supplier Delay - Midwest Distribution',
    description: 'Key supplier experiencing production delays due to equipment maintenance',
    location: { lat: 41.8781, lng: -87.6298 },
    region: 'Midwest',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    affectedStores: 23,
    estimatedImpact: '$450K',
    status: 'monitoring'
  },
  {
    id: '4',
    type: 'weather',
    severity: 'medium',
    title: 'Severe Thunderstorms - Texas',
    description: 'Severe weather warnings across central Texas affecting transportation routes',
    location: { lat: 30.2672, lng: -97.7431 },
    region: 'Southwest',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    affectedStores: 67,
    estimatedImpact: '$890K',
    status: 'active'
  }
];

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sort by timestamp (newest first)
    const sortedDisruptions = mockDisruptions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      disruptions: sortedDisruptions,
      summary: {
        total: mockDisruptions.length,
        active: mockDisruptions.filter(d => d.status === 'active').length,
        totalAffectedStores: mockDisruptions.reduce((sum, d) => sum + d.affectedStores, 0),
        totalEstimatedImpact: mockDisruptions.reduce((sum, d) => {
          const impact = parseFloat(d.estimatedImpact.replace(/[$MK,]/g, ''));
          const multiplier = d.estimatedImpact.includes('M') ? 1000000 : 1000;
          return sum + (impact * multiplier);
        }, 0)
      }
    });
  } catch (error) {
    console.error('Disruption API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}