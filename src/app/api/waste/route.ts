import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Mock waste data
const mockWasteData = [
  {
    id: 'WS-001',
    sku: 'SKU-98765-Organic-Spinach',
    productName: 'Organic Baby Spinach 5oz',
    category: 'Produce',
    location: 'Store #1247 - Miami, FL',
    currentStock: 145,
    expiryDate: '2025-07-12',
    daysUntilExpiry: 2,
    costPerUnit: 3.99,
    totalValue: 578.55,
    recommendations: [
      {
        action: 'markdown',
        discount: 30,
        expectedSales: 70,
        estimatedRevenue: 401.31,
        priority: 'high'
      },
      {
        action: 'transfer',
        targetStore: 'Store #1156 - Orlando, FL',
        transferCost: 45.00,
        expectedSales: 120,
        estimatedRevenue: 533.55,
        priority: 'medium'
      }
    ],
    wasteRisk: 'high',
    historicalWasteRate: 0.23
  },
  {
    id: 'WS-002',
    sku: 'SKU-45678-Greek-Yogurt',
    productName: 'Greek Yogurt 32oz Vanilla',
    category: 'Dairy',
    location: 'Store #892 - Austin, TX',
    currentStock: 89,
    expiryDate: '2025-07-13',
    daysUntilExpiry: 3,
    costPerUnit: 5.49,
    totalValue: 488.61,
    recommendations: [
      {
        action: 'bundle_promotion',
        bundleWith: 'Granola & Berries',
        discount: 25,
        expectedSales: 65,
        estimatedRevenue: 356.71,
        priority: 'high'
      },
      {
        action: 'markdown',
        discount: 20,
        expectedSales: 55,
        estimatedRevenue: 240.68,
        priority: 'medium'
      }
    ],
    wasteRisk: 'medium',
    historicalWasteRate: 0.15
  },
  {
    id: 'WS-003',
    sku: 'SKU-11223-Bakery-Bread',
    productName: 'Artisan Sourdough Loaf',
    category: 'Bakery',
    location: 'Store #445 - Seattle, WA',
    currentStock: 34,
    expiryDate: '2025-07-11',
    daysUntilExpiry: 1,
    costPerUnit: 4.99,
    totalValue: 169.66,
    recommendations: [
      {
        action: 'deep_markdown',
        discount: 50,
        expectedSales: 30,
        estimatedRevenue: 74.85,
        priority: 'urgent'
      },
      {
        action: 'donation',
        taxBenefit: 169.66,
        socialImpact: 'Feed 15 families',
        priority: 'medium'
      }
    ],
    wasteRisk: 'critical',
    historicalWasteRate: 0.31
  },
  {
    id: 'WS-004',
    sku: 'SKU-78901-Fresh-Berries',
    productName: 'Organic Blueberries 1 pint',
    category: 'Produce',
    location: 'Store #1523 - Denver, CO',
    currentStock: 78,
    expiryDate: '2025-07-14',
    daysUntilExpiry: 4,
    costPerUnit: 6.99,
    totalValue: 545.22,
    recommendations: [
      {
        action: 'promotional_display',
        discount: 15,
        expectedSales: 60,
        estimatedRevenue: 356.46,
        priority: 'medium'
      },
      {
        action: 'staff_purchase_program',
        discount: 40,
        expectedSales: 25,
        estimatedRevenue: 104.85,
        priority: 'low'
      }
    ],
    wasteRisk: 'low',
    historicalWasteRate: 0.08
  }
];

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sort by waste risk priority and days until expiry
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    const sortedWasteData = mockWasteData.sort((a, b) => {
      const priorityA = priorityOrder[a.wasteRisk as keyof typeof priorityOrder];
      const priorityB = priorityOrder[b.wasteRisk as keyof typeof priorityOrder];
      
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.daysUntilExpiry - b.daysUntilExpiry;
    });

    // Calculate summary statistics
    const totalValue = mockWasteData.reduce((sum, item) => sum + item.totalValue, 0);
    const criticalItems = mockWasteData.filter(item => item.wasteRisk === 'critical').length;
    const expiringToday = mockWasteData.filter(item => item.daysUntilExpiry <= 1).length;
    const potentialWasteValue = mockWasteData.reduce((sum, item) => {
      return sum + (item.totalValue * item.historicalWasteRate);
    }, 0);

    return NextResponse.json({
      items: sortedWasteData,
      summary: {
        totalItems: mockWasteData.length,
        totalValue: totalValue,
        criticalItems: criticalItems,
        expiringToday: expiringToday,
        potentialWasteValue: potentialWasteValue,
        averageWasteRate: mockWasteData.reduce((sum, item) => sum + item.historicalWasteRate, 0) / mockWasteData.length,
        categoriesAffected: [...new Set(mockWasteData.map(item => item.category))].length
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Waste API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}