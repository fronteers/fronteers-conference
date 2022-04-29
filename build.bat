cross-env ELEVENTY_PRODUCTION=true eleventy && cross-env NODE_ENV=production postcss styles/tailwind.css --o _site/style.css && cleancss _site/style.css -o _site/style.css
