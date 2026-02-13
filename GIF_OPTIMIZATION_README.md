# GIF Optimization Guide for Oncle G Website

This guide explains how to optimize GIFs for faster loading on the Oncle G website using FFmpeg.

## Why Optimize GIFs?

Large GIF files significantly slow down page load times. Optimizing them reduces file sizes while maintaining acceptable quality, leading to better user experience.

## Prerequisites

- Python 3.x
- FFmpeg installed on your system

### Installing FFmpeg

#### On macOS:
```bash
brew install ffmpeg
```

#### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### On CentOS/RHEL:
```bash
sudo yum install ffmpeg
```

## Available Scripts

### 1. Basic GIF Optimization (`optimize_gifs_with_ffmpeg.py`)

This script uses FFmpeg to optimize GIFs with various quality settings.

#### Features:
- Multiple quality levels (low, medium, high, lossless)
- Palette-based optimization for better compression
- Batch processing of all GIFs in the directory
- Size reduction statistics

#### Usage:
```bash
python optimize_gifs_with_ffmpeg.py
```

Follow the prompts to select optimization method and quality settings.

### 2. GIF to Video Conversion (`convert_gifs_to_videos.py`)

For very large GIFs (>1MB), converting to video formats (MP4/WebM) provides superior compression.

#### Features:
- Converts GIFs to MP4 format
- Maintains animation quality with much smaller file sizes
- Provides HTML code examples for embedding videos

#### Usage:
```bash
python convert_gifs_to_videos.py
```

## Best Practices

### For Small to Medium GIFs (< 1MB):
1. Use `optimize_gifs_with_ffmpeg.py` with medium quality setting
2. This typically achieves 30-60% size reduction

### For Large GIFs (> 1MB):
1. Use `convert_gifs_to_videos.py` to convert to MP4
2. This typically achieves 70-90% size reduction
3. Update HTML to use `<video>` tags instead of `<img>` tags

### HTML Implementation Examples

#### For Optimized GIFs:
```html
<img src="optimized_gifs/optimized_your_image.gif" alt="Description">
```

#### For Converted Videos (with GIF fallback):
```html
<video poster="gif/original.gif" muted autoplay loop playsinline>
  <source src="videos/your_video.mp4" type="video/mp4">
  <img src="gif/original.gif" alt="Description">
</video>
```

## Performance Tips

1. **Lazy Loading**: Implement lazy loading for GIFs below the fold:
   ```html
   <img src="placeholder.jpg" data-src="optimized_gifs/image.gif" loading="lazy" alt="Description">
   ```

2. **Responsive Images**: Use responsive images for different screen sizes:
   ```html
   <picture>
     <source media="(max-width: 768px)" srcset="optimized_gifs/small_image.gif">
     <img src="optimized_gifs/large_image.gif" alt="Description">
   </picture>
   ```

3. **CDN**: Serve optimized images from a CDN for faster global delivery.

## Expected Results

- **Basic optimization**: 30-60% file size reduction
- **Video conversion**: 70-90% file size reduction
- **Loading speed improvement**: 2-5x faster depending on original file size

## Troubleshooting

### FFmpeg Not Found
If you get an error saying FFmpeg is not found:
1. Verify FFmpeg installation: `ffmpeg -version`
2. Make sure FFmpeg is in your system PATH
3. Reinstall FFmpeg if necessary

### Poor Quality After Optimization
- Try a higher quality setting (medium or high instead of low)
- For critical images, use lossless optimization
- Consider keeping the original if quality degradation is unacceptable

### Script Issues
- Ensure you're running Python 3.x
- Check file permissions
- Verify all GIF files exist and are readable

## Maintenance

Regularly optimize new GIFs added to the site:
1. Run the optimization script weekly or when adding new images
2. Monitor page load speeds using browser developer tools
3. Replace any remaining large GIFs with video formats