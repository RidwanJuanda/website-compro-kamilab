#!/bin/bash

# Threshold size in bytes (500KB)
THRESHOLD=500000

find images -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read -r file; do
    size=$(wc -c < "$file")
    if [ "$size" -gt "$THRESHOLD" ]; then
        echo "Compressing $file (Size: $((size/1024))KB)..."
        
        # Check if it's a PNG
        if [[ "$file" == *.png ]]; then
             # For PNGs, we might want to convert to JPG if no transparency is needed, 
             # but to be safe and automatic, we'll just resample/compress 
             # or convert to high-quality JPG if it's huge?
             # Let's try to just resample width if it's massive, or just optimize.
             # sips doesn't compress PNGs well without size change.
             # Let's convert to JPEG if it's > 1MB, otherwise just leave it (risky for transparency).
             # ACTUALLY, safely, let's just resize huge images to max 1920px width/height.
             sips -Z 1920 "$file" > /dev/null
        else
             # For JPGs, set quality to 70% and max dim 1920
             sips -Z 1920 -s formatOptions 70 "$file" > /dev/null
        fi
        
        new_size=$(wc -c < "$file")
        echo "  -> New Size: $((new_size/1024))KB"
    fi
done

# Specifically target the massive files I noticed
echo "Specific optimizations..."

# tiketboxhomefull.png (4.1MB) - This likely doesn't need transparency if it's a screenshot. 
# converting to jpg.
if [ -f "images/tiketboxhomefull.png" ]; then
    echo "Converting images/tiketboxhomefull.png to JPG..."
    sips -s format jpeg -s formatOptions 70 "images/tiketboxhomefull.png" --out "images/tiketboxhomefull.jpg"
    rm "images/tiketboxhomefull.png"
fi

# layarhome.png (2.8MB)
if [ -f "images/layarhome.png" ]; then
    echo "Converting images/layarhome.png to JPG..."
    sips -s format jpeg -s formatOptions 70 "images/layarhome.png" --out "images/layarhome.jpg"
    rm "images/layarhome.png"
fi

echo "Done."
