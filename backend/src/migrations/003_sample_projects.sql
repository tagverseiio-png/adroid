-- Sample Data Script for Testing Selected Works Feature
-- This script adds some sample projects and marks a few as featured

-- Note: Run this AFTER the main migration and featured works migration

-- Sample Projects
INSERT INTO projects (title, slug, category, type, location, year, area, client, status, design_style, cover_image, description, published, is_featured, featured_order)
VALUES 
    (
        'Azure Villa',
        'azure-villa',
        'VILLAS',
        'ARCHITECTURE',
        'Malibu, California',
        '2024',
        '5000 sq ft',
        'Private Client',
        'Completed',
        'Contemporary',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
        'A stunning contemporary villa overlooking the Pacific Ocean, featuring floor-to-ceiling windows and minimalist design.',
        true,
        true,
        1
    ),
    (
        'The Onyx Tower',
        'the-onyx-tower',
        'IT & ITES OFFICES',
        'ARCHITECTURE',
        'Dubai, UAE',
        '2024',
        '50000 sq ft',
        'Tech Corp',
        'Completed',
        'Modern',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop',
        'A sleek modern office building with state-of-the-art facilities and sustainable design features.',
        true,
        true,
        2
    ),
    (
        'Serenity Spa & Wellness',
        'serenity-spa-wellness',
        'CLUBS & RESTO BARS',
        'INTERIOR',
        'Kyoto, Japan',
        '2023',
        '8000 sq ft',
        'Wellness Group',
        'Completed',
        'Japanese Minimalism',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2592&auto=format&fit=crop',
        'A tranquil spa space blending traditional Japanese aesthetics with modern wellness concepts.',
        true,
        true,
        3
    ),
    (
        'Vanguard Headquarters',
        'vanguard-headquarters',
        'IT & ITES OFFICES',
        'INTERIOR',
        'Berlin, Germany',
        '2024',
        '30000 sq ft',
        'Vanguard Inc',
        'Completed',
        'Industrial Modern',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop',
        'Corporate headquarters featuring open workspaces, collaborative zones, and innovative design.',
        true,
        true,
        4
    ),
    (
        'Green Valley Residence',
        'green-valley-residence',
        'INDIVIDUAL BUNGALOWS',
        'ARCHITECTURE',
        'Bangalore, India',
        '2023',
        '3500 sq ft',
        'Private Client',
        'Completed',
        'Tropical Modern',
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
        'A sustainable home integrated with nature, featuring indoor-outdoor living spaces.',
        true,
        false,
        0
    ),
    (
        'Metropolitan Cafe',
        'metropolitan-cafe',
        'CLUBS & RESTO BARS',
        'INTERIOR',
        'London, UK',
        '2024',
        '2000 sq ft',
        'Metro Group',
        'Ongoing',
        'Contemporary',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop',
        'A chic urban cafe with industrial elements and warm, inviting interiors.',
        true,
        false,
        0
    ),
    (
        'Skyline Apartments',
        'skyline-apartments',
        'APARTMENTS',
        'ARCHITECTURE',
        'Mumbai, India',
        '2024',
        '100000 sq ft',
        'Skyline Developers',
        'Ongoing',
        'Modern Luxe',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop',
        'Luxury residential complex with premium amenities and stunning city views.',
        false,
        false,
        0
    ),
    (
        'Coastal Resort',
        'coastal-resort',
        'RESORTS & HOTELS',
        'ARCHITECTURE',
        'Maldives',
        '2025',
        '75000 sq ft',
        'Resort Holdings',
        'Planning',
        'Tropical Contemporary',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2670&auto=format&fit=crop',
        'A boutique resort offering luxury accommodations with breathtaking ocean views.',
        false,
        false,
        0
    )
ON CONFLICT (slug) DO NOTHING;

-- Update counts
DO $$
DECLARE
    total_count INTEGER;
    featured_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM projects;
    SELECT COUNT(*) INTO featured_count FROM projects WHERE is_featured = true;
    
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Total projects: %', total_count;
    RAISE NOTICE 'Featured projects: %', featured_count;
END $$;
