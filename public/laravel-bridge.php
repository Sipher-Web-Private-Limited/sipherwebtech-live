<?php
declare(strict_types=1);

$laravelRoot = '/home/u415380968/sipherwebtech-cms';
$laravelPublic = $laravelRoot . '/public';

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

// Handle /storage/ media requests directly from storage/app/public
if (str_starts_with($uri, '/storage/')) {
    $relativePath = substr($uri, strlen('/storage/'));
    $storagePublic = $laravelRoot . '/storage/app/public';
    $filePath = realpath($storagePublic . '/' . ltrim($relativePath, '/'));

    if ($filePath && str_starts_with($filePath, realpath($storagePublic) ?: $storagePublic) && is_file($filePath)) {
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'webp' => 'image/webp',
            'pdf' => 'application/pdf',
        ];
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $contentType = $mimeTypes[$ext] ?? mime_content_type($filePath) ?: 'application/octet-stream';

        header('Content-Type: ' . $contentType);
        header('Content-Length: ' . (string) filesize($filePath));
        header('Cache-Control: public, max-age=86400');
        readfile($filePath);
        exit;
    }

    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'File not found';
    exit;
}

$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $laravelPublic . '/index.php';

require $laravelPublic . '/index.php';
