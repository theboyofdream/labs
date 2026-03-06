# Release Monitor

A clean, minimal GitHub release monitoring tool that tracks the latest releases from multiple repositories in one interface.

## Features

- **Multi-repo monitoring**: Track releases from multiple GitHub repositories
- **Real-time updates**: Fetches latest release data from GitHub API
- **Search & filter**: Find specific releases with fuzzy search
- **Dark/Light themes**: Automatic theme detection with manual override
- **Responsive design**: Works seamlessly on desktop and mobile
- **Local storage**: Saves your repository preferences locally
- **Import/Export**: Backup and restore your repository list

## Usage

1. Click "add sources" to add repositories
2. Enter GitHub repository URLs or `owner/repo` format
3. Select repositories to monitor using the chips
4. Click on repository cards to view release details
5. Use the search bar to filter releases
6. Adjust depth to control how many releases to show

## Repository Format

Add repositories in either format:
- `https://github.com/vercel/next.js`
- `vercel/next.js`

## Local Development

This is a static HTML application. Simply open `index.html` in a web browser or serve it with any static web server.

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## API Usage

This application uses the GitHub REST API to fetch release data:
- Endpoint: `https://api.github.com/repos/{owner}/{repo}/releases`
- Rate limits apply for unauthenticated requests
- No API key required for basic usage

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Performance

- Optimized font loading (non-blocking)
- Efficient DOM manipulation
- Local caching for release data
- Minimal dependencies

## License

MIT License - feel free to use and modify.

## Contributing

Contributions welcome! This is a simple client-side application focused on clean design and usability.
