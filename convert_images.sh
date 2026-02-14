#!/bin/bash

# Threshold 1MB
THRESHOLD=1000000

find images -name "*.png" -type f | while read -r png_file; do
    size=$(wc -c < "$png_file")
    if [ "$size" -gt "$THRESHOLD" ]; then
        jpg_file="${png_file%.png}.jpg"
        filename=$(basename "$png_file")
        jpg_filename=$(basename "$jpg_file")
        
        echo "Processing $png_file ($((size/1024))KB)..."
        
        # Convert to JPG with 75% quality
        sips -s format jpeg -s formatOptions 75 "$png_file" --out "$jpg_file" > /dev/null
        
        new_size=$(wc -c < "$jpg_file")
        
        if [ "$new_size" -lt "$size" ]; then
            echo "  -> Converted to $jpg_filename ($((new_size/1024))KB). Updating HTML..."
            
            # Update all HTML files
            # limit strictly to filename to avid partial matches if any
            # match "images/filename.png" or just "filename.png"
            # simple sed: s/filename.png/filename.jpg/g
            
            # Using find to get all html files
            find . -maxdepth 1 -name "*.html" -print0 | xargs -0 sed -i '' "s/$filename/$jpg_filename/g"
            
            echo "  -> Updated references."
        else
            echo "  -> JPG was not smaller (unlikely). Scrapping JPG."
            rm "$jpg_file"
        fi
    fi
done
