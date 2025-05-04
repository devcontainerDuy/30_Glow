{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($items as $item)
        <url>
            <loc>{{ htmlspecialchars($item->url, ENT_XML1, 'UTF-8') }}</loc>
            @if ($item->lastmod)
                <lastmod>{{ $item->lastmod->toW3cString() }}</lastmod>
            @endif
            @if ($item->changefreq)
                <changefreq>{{ $item->changefreq }}</changefreq>
            @endif
            @if ($item->priority)
                <priority>{{ $item->priority }}</priority>
            @endif
        </url>
    @endforeach
</urlset>
