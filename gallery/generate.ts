import { cp, rm } from 'node:fs/promises';

const output = 'public/gallery';
const galleryUrl = '/gallery/';
const singlesUrl = `${galleryUrl}singles/`;

type Photo = {
  title: string;
  subtitle?: string;
  description?: string;
  alt?: string;
  file: string;
  width: number;
  height: number;
  variants?: Record<string, string>;
};

type Project = {
  slug: string;
  title: string;
  artist_statement: string;
  photos: [Photo, ...Photo[]];
};

type Single = Photo & { slug: string };

const { projects = [], singles = [] } = Bun.TOML.parse(await Bun.file('gallery/projects.toml').text()) as {
  projects?: Project[];
  singles?: Single[];
};

const slugs = new Set<string>();
for (const project of projects) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) {
    throw new Error(`Invalid or duplicate project slug: ${project.slug}`);
  }
  if (!project.photos?.length) {
    throw new Error(`Add at least one photo to ${project.slug}`);
  }
  slugs.add(project.slug);
}

const singleSlugs = new Set<string>();
for (const photo of singles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(photo.slug) || singleSlugs.has(photo.slug)) {
    throw new Error(`Invalid or duplicate single photo slug: ${photo.slug}`);
  }
  singleSlugs.add(photo.slug);
}

for (const photo of [...projects.flatMap(project => project.photos), ...singles]) {
  for (const file of [photo.file, ...Object.values(photo.variants ?? {})]) {
    if (!/^[\w.-]+$/.test(file) || !await Bun.file(`gallery/photos/${file}`).exists()) {
      throw new Error(`Missing photo for ${photo.title}: ${file}`);
    }
  }
}

const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escape = (value: string) => value.replace(/[&<>"]/g, character => entities[character]);

function page(title: string, description: string, content: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escape(description)}">
    <link rel="icon" type="image/png" href="/avatartion.png">
    <title>${escape(title.toLowerCase())}</title>
    <link rel="stylesheet" href="${galleryUrl}style.css">
  </head>
  <body>
    <main>
      ${content}
    </main>
  </body>
</html>
`;
}

function image(photo: Photo, sizes: string, alt = photo.alt ?? photo.title) {
  const variants = Object.entries(photo.variants ?? {})
    .map(([width, file]) => `${galleryUrl}photos/${escape(file)} ${escape(width)}w`)
    .join(', ');
  const responsive = variants ? ` srcset="${variants}" sizes="${sizes}"` : '';

  return `<img src="${galleryUrl}photos/${escape(photo.file)}"${responsive} alt="${escape(alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">`;
}

function caption(photo: Photo) {
  return `<figcaption>
    <h2>${escape(photo.title)}</h2>
    ${photo.subtitle ? `<p>${escape(photo.subtitle)}</p>` : ''}
    ${photo.description ? `<p>${escape(photo.description)}</p>` : ''}
  </figcaption>`;
}

function photoPath(project: Project, index: number) {
  const collection = `projects/${project.slug}/`;
  return index === 0 ? collection : `${collection}${index + 1}/`;
}

function arrow(label: string, symbol: string, url?: string) {
  return url
    ? `<a href="${url}" aria-label="${label}">${symbol}</a>`
    : `<span aria-hidden="true">${symbol}</span>`;
}

function photoViewer(photo: Photo, index: number, urls: string[]) {
  return `<nav class="photo-navigation" aria-label="photo navigation">
    ${arrow('previous photo', '←', urls[index - 1])}
    <span>${index + 1}/${urls.length}</span>
    ${arrow('next photo', '→', urls[index + 1])}
  </nav>
  <figure class="collection-photo" style="--photo-ratio: ${photo.width / photo.height}">
    ${image(photo, 'auto, 100vw')}${caption(photo)}
  </figure>
  <script type="module" src="${galleryUrl}fit-photo.js"></script>`;
}

function singleGrid(photos: Single[]) {
  if (!photos.length) return '<p>no singles yet.</p>';

  return `<ul class="singles-grid">${photos.map(photo => `<li>
    <a href="${singlesUrl}${photo.slug}/">
      ${image(photo, 'auto, (max-width: 32rem) 45vw, 33vw', '')}
      <span>${escape(photo.title)}</span>
    </a>
  </li>`).join('\n')}</ul>`;
}

await rm(output, { recursive: true, force: true });
await Bun.write(`${output}/style.css`, Bun.file('gallery/style.css'));
await Bun.write(`${output}/fit-photo.js`, Bun.file('gallery/fit-photo.js'));
await cp('gallery/photos', `${output}/photos`, { recursive: true });
for (const file of ['cmunrm.woff2', 'cmunbx.woff2', 'SIL Open Font License.txt']) {
  await Bun.write(`${output}/fonts/${file}`, Bun.file(`src/assets/fonts/cmu/${file}`));
}

const index = projects.map(project => {
  const url = `${galleryUrl}${photoPath(project, 0)}`;
  return `<article id="project-${project.slug}">
    <h2 class="project-title"><a href="${url}">${escape(project.title)}</a></h2>
    <p class="statement">${escape(project.artist_statement)}</p>
    <a class="view-collection" href="${url}" aria-label="view ${escape(project.title)}">view</a>
    <a class="preview" href="${url}">${image(project.photos[0], 'auto, (max-width: 62rem) 92vw, 58rem', `view ${project.title}`)}</a>
  </article>`;
}).join('\n');

await Bun.write(`${output}/index.html`, page('gallery/jefferson ding', 'photography projects and singles', `
  <h1 class="visually-hidden">photography</h1>
  <div class="gallery-layout">
    <nav class="gallery-index" aria-label="gallery index">
      <ul>
        <li><a href="#singles">singles</a></li>
        ${projects.map(project => `<li><a href="#project-${project.slug}">${escape(project.title)}</a></li>`).join('\n')}
      </ul>
    </nav>
    <div class="projects">
      <section id="singles">
        <h2 class="project-title">singles</h2>
        ${singleGrid(singles.slice(0, 6))}
        <a class="view-more" href="${singlesUrl}" aria-label="view more singles">view more</a>
      </section>
      ${index}
    </div>
  </div>
`));

await Bun.write(`${output}/singles/index.html`, page('singles', 'standalone photographs', `
  <section class="singles-page">
    <a class="back" href="${galleryUrl}">← gallery</a>
    <h1 class="project-title">singles</h1>
    ${singleGrid(singles)}
  </section>
`));

const singleUrls = singles.map(photo => `${singlesUrl}${photo.slug}/`);
for (const [index, photo] of singles.entries()) {
  await Bun.write(`${output}/singles/${photo.slug}/index.html`, page(photo.title, photo.description ?? 'standalone photograph', `
    <div class="collection-intro">
      <a class="back" href="${singlesUrl}">← singles</a>
      <h1 class="visually-hidden">${escape(photo.title)}</h1>
    </div>
    ${photoViewer(photo, index, singleUrls)}
  `));
}

for (const project of projects) {
  const urls = project.photos.map((_, index) => `${galleryUrl}${photoPath(project, index)}`);
  for (const [index, photo] of project.photos.entries()) {
    await Bun.write(`${output}/${photoPath(project, index)}index.html`, page(`${project.title} / ${photo.title}`, project.artist_statement, `
      <div class="collection-intro">
        <a class="back" href="${galleryUrl}">← projects</a>
        <h1 class="project-title">${escape(project.title)}</h1>
        <p class="statement">${escape(project.artist_statement)}</p>
      </div>
      ${photoViewer(photo, index, urls)}
    `));
  }
}
