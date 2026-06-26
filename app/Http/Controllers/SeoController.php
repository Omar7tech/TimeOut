<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * Crawl rules. Served dynamically so the sitemap URL always points at the
     * live domain regardless of environment.
     */
    public function robots(): Response
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            '',
            'Sitemap: '.url('/sitemap.xml'),
            '',
        ];

        return response(implode("\n", $lines), 200)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * XML sitemap of the public storefront pages. The delivery menu is only
     * listed while online ordering is active.
     */
    public function sitemap(GeneralSettings $settings): Response
    {
        $urls = [
            ['loc' => route('home'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => route('menu.dine-in'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ];

        if ($settings->online_ordering_active) {
            $urls[] = ['loc' => route('menu.delivery'), 'priority' => '0.9', 'changefreq' => 'weekly'];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= '  <url>'."\n";
            $xml .= '    <loc>'.e($url['loc']).'</loc>'."\n";
            $xml .= '    <changefreq>'.$url['changefreq'].'</changefreq>'."\n";
            $xml .= '    <priority>'.$url['priority'].'</priority>'."\n";
            $xml .= '  </url>'."\n";
        }

        $xml .= '</urlset>'."\n";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }
}
