import { loadEnv, defineConfig } from 'vite'
import vituum from 'vituum'
import twig from '@vituum/vite-plugin-twig'
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper'

export default config => {
	process.env = {
		...process.env,
		...loadEnv(config.mode, process.cwd(), ''),
	}

	return defineConfig({
		base: process.env.VITE_APP_BASE_URL,

		plugins: [
			vituum({
				imports: {
					filenamePattern: {
						'+.css': [],
						'+.scss': 'src/styles',
					},
				},
			}),

			twig({
				root: 'src',
			}),

			ViteSvgSpriteWrapper({
				icons: 'public/images/icons/*.svg',
				outputDir: 'public',
				sprite: {
					shape: {
						transform: ['svgo'],
					},
				},
			}),
		],

		server: {
			port: 5500,
			host: '0.0.0.0',
			hmr: true,
		},

		build: {
			target: 'esnext',

			outDir: 'dist',

			rollupOptions: {
				input: ['src/pages/**/*.twig'],

				output: {
					assetFileNames: inf => {
						let extType = inf.name.split('.').reverse()[0]

						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'img'
						}

						if (/css/i.test(extType)) {
							return `assets/css/main.css`
						}

						return `assets/${extType}/[name][extname]`
					},

					chunkFileNames: 'assets/js/main.js',

					entryFileNames: 'assets/js/main.js',
				},
			},
		},
	})
}
