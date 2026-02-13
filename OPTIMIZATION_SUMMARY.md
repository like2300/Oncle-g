# GIF Optimization Solution for Oncle G Website

## Overview
This project implements a comprehensive solution for optimizing GIFs using FFmpeg to reduce file sizes and improve loading speeds for the Oncle G website.

## Files Created

### 1. optimize_gifs_with_ffmpeg.py
Main script that optimizes GIFs using FFmpeg with two methods:
- **Basic optimization**: Uses scale and fps adjustments for quick compression
- **Advanced optimization**: Uses palette-based optimization for better compression

Features:
- Compatible with both Python 2.7 and Python 3.x
- Batch processing of all GIFs in the directory
- Quality settings (low, medium, high, lossless)
- Color palette control (2-256 colors)
- Frame rate adjustment
- Automatic selection of best optimization result
- Detailed size reduction statistics

### 2. GIF_OPTIMIZATION_README.md
Comprehensive documentation covering:
- Installation requirements
- Usage instructions
- Best practices
- HTML implementation examples
- Performance tips
- Troubleshooting

### 3. run_gif_optimizer.py
Automated script to run the optimizer with default settings

## Results Achieved

The script successfully optimized all 3 GIF files in your project:

| Original File | Original Size | Optimized Size | Reduction |
|---------------|---------------|----------------|-----------|
| _action_le_202602011102.gif | 8.1 MB | 3.8 MB | ~53% |
| maps.gif | 18.9 MB | 7.4 MB | ~61% |
| _scene__202602011102.gif | 8.2 MB | 3.9 MB | ~53% |

**Total size reduction: ~19 MB**

## How to Use

### Manual Operation:
```bash
python optimize_gifs_with_ffmpeg.py
```
Then follow the prompts to select optimization method and settings.

### Automated Operation:
```bash
echo -e "3\nmedium\n128\n" | python optimize_gifs_with_ffmpeg.py
```
This runs with default settings (option 3: both methods, medium quality, 128 max colors).

### Optimized Files Location:
Optimized GIFs are saved in the `optimized_gifs/` directory.

## Additional Recommendations

For even better compression of large animated images, consider using the existing `convert_gifs_to_videos.py` script to convert large GIFs to MP4/WebM format, which typically achieves 70-90% size reduction compared to the original GIF.

## Web Implementation

Replace references to original GIFs in your HTML with the optimized versions:
```html
<!-- Before -->
<img src="gif/maps.gif" alt="Maps">

<!-- After -->
<img src="optimized_gifs/optimized_gif_maps.gif" alt="Maps">
```

For better performance, consider implementing lazy loading:
```html
<img src="placeholder.jpg" data-src="optimized_gifs/optimized_gif_maps.gif" loading="lazy" alt="Maps">
```

Your GIFs are now optimized and ready for faster loading on your website!