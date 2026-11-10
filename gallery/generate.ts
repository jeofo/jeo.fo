import { cp, rm } from 'node:fs/promises';

const output = 'public/gallery';
const galleryUrl = '/gallery/';

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

const { projects } = Bun.TOML.parse(await Bun.file('gallery/projects.toml').text()) as {
  projects: Project[];
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

  for (const photo of project.photos) {
    for (const file of [photo.file, ...Object.values(photo.variants ?? {})]) {
      if (!/^[\w.-]+$/.test(file) || !await Bun.file(`gallery/photos/${file}`).exists()) {
        throw new Error(`Missing photo for ${project.slug}: ${file}`);
      }
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
    <title>${escape(title)} / jefferson ding</title>
    <link rel="stylesheet" href="${galleryUrl}style.css">
  </head>
  <body>
    <header><a href="/">jefferson ding</a></header>
    <main>
      ${content}
    </main>
  </body>
</html>
`;
}

function image(photo: Photo, previewTitle?: string) {
  const variants = Object.entries(photo.variants ?? {})
    .map(([width, file]) => `${galleryUrl}photos/${escape(file)} ${escape(width)}w`)
    .join(', ');
  const responsive = variants ? ` srcset="${variants}" sizes="auto, (max-width: 62rem) 92vw, 58rem"` : '';
  const alt = previewTitle ? `View ${previewTitle}` : photo.alt ?? photo.title;

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

await rm(output, { recursive: true, force: true });
await Bun.write(`${output}/style.css`, Bun.file('gallery/style.css'));
await cp('gallery/photos', `${output}/photos`, { recursive: true });
for (const file of ['cmunrm.woff2', 'cmunbx.woff2', 'SIL Open Font License.txt']) {
  await Bun.write(`${output}/fonts/${file}`, Bun.file(`src/assets/fonts/cmu/${file}`));
}

const index = projects.map(project => {
  const url = `${galleryUrl}${photoPath(project, 0)}`;
  return `<article>
    <h2 class="project-title"><a href="${url}">${escape(project.title)}</a></h2>
    <p class="statement">${escape(project.artist_statement)}</p>
    <a class="view-collection" href="${url}" aria-label="View collection: ${escape(project.title)}">View collection</a>
    <a class="preview" href="${url}">${image(project.photos[0], project.title)}</a>
  </article>`;
}).join('\n');

await Bun.write(`${output}/index.html`, page('photography', 'Photography projects by Jefferson Ding.', `
  <h1 class="visually-hidden">Photography projects</h1>
  <div class="projects">${index}</div>
`));

for (const project of projects) {
  for (const [index, photo] of project.photos.entries()) {
    const previous = index > 0 ? `${galleryUrl}${photoPath(project, index - 1)}` : undefined;
    const next = index + 1 < project.photos.length ? `${galleryUrl}${photoPath(project, index + 1)}` : undefined;

    await Bun.write(`${output}/${photoPath(project, index)}index.html`, page(`${project.title} / ${photo.title}`, project.artist_statement, `
      <a class="back" href="${galleryUrl}">← Projects</a>
      <h1 class="project-title">${escape(project.title)}</h1>
      <p class="statement">${escape(project.artist_statement)}</p>
      <nav class="photo-navigation" aria-label="Collection navigation">
        ${arrow('Previous photo', '←', previous)}
        <span>${index + 1}/${project.photos.length}</span>
        ${arrow('Next photo', '→', next)}
      </nav>
      <figure>${image(photo)}${caption(photo)}</figure>
    `));
  }
}
