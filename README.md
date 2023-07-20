# Build-a-Site AI

Build-a-Site AI is an automated website builder that leverages the power of AI to generate content and images for your website. The application uses OpenAI API for content creation and Stable Diffusion AI for image generation. The content is then added to prebuilt section templates and styled using TailwindCSS. The processed content is stored in an AWS S3 bucket which is made public. Users have the option to edit and update the content, and when saved, the site files are updated in the bucket. Users can also add a domain using Cloudflare.

## Features

- AI-powered content and image generation
- Prebuilt section templates
- Styling using TailwindCSS
- Content storage in AWS S3 bucket
- Editable content
- Domain addition using Cloudflare

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm
- You have a basic understanding of JavaScript and Node.js

## Installing Build-a-Site AI

To install Build-a-Site AI, follow these steps:

1. Clone the repo
```git clone https://github.com/i-dream-of-ai/build-a-site```

2. Install NPM packages
```npm install```


## Using Build-a-Site AI

To use Build-a-Site AI, follow these steps:

1. Rename `.env.example` to `.env` and update the values with your credentials.
2. Run the following command in your terminal:
```npm run start```


## Contributing to Build-a-Site AI

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/i-dream-of-ai/build-a-site/issues). You can also take a look at the contributing guide.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Support

Give a ⭐️ if this project helped you!

## Contact

If you want to contact me, you can reach me at `<j@idreamofai.com>`.

## License

This project uses the MIT License. See the [LICENSE](LICENSE) file for details.