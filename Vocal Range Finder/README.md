# Vocal Range Finder

An interactive web application that helps singers find their vocal range and suggests songs within their range. Features include:
- Piano keyboard for note selection
- Real-time pitch detection
- Voice type identification
- Song suggestions based on vocal range
- Genre filtering
- Enhanced visualization

## Features

- **Interactive Piano**: Click keys to hear notes and set your range
- **Pitch Detection**: Uses advanced algorithms for accurate note detection
- **Visual Feedback**: Real-time waveform visualization and pitch accuracy indication
- **Song Database**: Extensive collection of songs across multiple genres
- **Voice Type Detection**: Automatically determines your voice type based on range

## Deployment to Netlify

1. Create a Netlify account at [netlify.com](https://www.netlify.com)
2. Install Netlify CLI (optional):
   ```bash
   npm install netlify-cli -g
   ```

3. Deploy using Netlify UI:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop this project folder to the Netlify UI
   - Or click "New site from Git" and connect your repository

4. Deploy using Netlify CLI:
   ```bash
   netlify deploy
   ```

## WordPress Integration

There are several ways to integrate this app with your WordPress site:

### Option 1: Iframe Embed (Simplest)
After deploying to Netlify, add this code to your WordPress page using Elementor HTML widget:

```html
<iframe 
  src="your-netlify-url" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none; max-width: 100%; margin: 0 auto; display: block;"
></iframe>
```

### Option 2: Subdomain Setup
1. Create a subdomain (e.g., vocalrange.yoursite.com)
2. In Netlify:
   - Go to Domain Settings
   - Add custom domain
   - Point your subdomain's DNS to Netlify

### Option 3: Custom Path Integration
1. In WordPress, create a new page (e.g., /vocal-range-finder)
2. Use Elementor's full-width template
3. Add HTML widget with the iframe code
4. Style the page to match your site's theme

## Browser Support

The application requires:
- Modern browser with Web Audio API support
- Microphone access for pitch detection
- JavaScript enabled
- Recommended browsers: Chrome, Firefox, Edge, Safari (latest versions)

## Privacy Considerations

The application:
- Requires microphone access for pitch detection
- Processes audio locally (no data sent to servers)
- Uses YouTube links for song references
- No personal data collection or storage

## Troubleshooting

Common issues and solutions:

1. Microphone Access:
   - Ensure browser has microphone permissions
   - Check browser settings if permission dialog doesn't appear
   - Use HTTPS for reliable microphone access

2. Audio Issues:
   - Check microphone input levels
   - Ensure no other apps are using the microphone
   - Try refreshing the page if pitch detection seems inaccurate

3. Display Issues:
   - Clear browser cache if visualizations aren't working
   - Check for browser compatibility
   - Ensure JavaScript is enabled

## Support

For issues or questions:
1. Check browser console for errors
2. Verify microphone permissions
3. Test in different browsers
4. Clear browser cache and reload

## License

MIT License - Feel free to use, modify, and distribute as needed.
